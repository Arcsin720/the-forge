import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createProgramForUser } from "@/lib/programs";
import { sendProgramConfirmationEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { logPaymentSucceeded, logProgramGenerated, logApiError } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function retryAsync<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`[WEBHOOK] Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return retryAsync(fn, retries - 1);
    }
    throw error;
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("[WEBHOOK] Missing signature or webhookSecret");
    return new NextResponse("Missing configuration", { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[WEBHOOK] Invalid signature:", error);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log(`[WEBHOOK] Event received: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const startTime = Date.now();
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata;

    console.log(`[WEBHOOK] Checkout completed. Session ID: ${session.id}`);
    console.log(`[WEBHOOK] Metadata:`, metadata);

    if (
      session.id &&
      metadata &&
      metadata.userId &&
      metadata.goal &&
      metadata.level &&
      metadata.frequency &&
      metadata.tier
    ) {
      try {
        // Vérifier si le programme existe déjà (idempotency)
        const existing = await retryAsync(
          () =>
            prisma.program.findUnique({
              where: {
                stripeCheckoutId: session.id
              }
            }),
          2
        );

        if (existing) {
          console.log(`[WEBHOOK] Program already exists for session ${session.id}`);
          return new NextResponse("ok", { status: 200 });
        }

        console.log(`[WEBHOOK] Creating program for userId: ${metadata.userId}`);

        // Créer le programme avec retry
        const program = await retryAsync(
          () =>
            createProgramForUser(
              metadata.userId,
              {
                goal: metadata.goal,
                level: metadata.level,
                frequency: metadata.frequency,
                tier: metadata.tier as "BASIC" | "PRO" | "ELITE"
              },
              session.id
            ),
          2
        );

        console.log(`[WEBHOOK] Program created successfully: ${program.id}`);

        // Log analytics
        logPaymentSucceeded(metadata.userEmail, metadata.tier, metadata.goal, session.id);
        const endTime = Date.now();
        logProgramGenerated(metadata.userEmail, metadata.tier, metadata.goal, endTime - startTime);

        // Envoyer email de confirmation (optionnel)
        if (metadata.userEmail) {
          await sendProgramConfirmationEmail(
            metadata.userEmail,
            "", // name pas disponible dans metadata
            metadata.tier,
            metadata.goal
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("[WEBHOOK] Error creating program:", errorMsg);
        logApiError("webhook_stripe", errorMsg);
        // Même après retries, on retourne 200 pour que Stripe ne resend pas
        // (l'erreur est loggée pour debug)
        return new NextResponse(
          JSON.stringify({ error: "Failed to create program", logged: true }),
          { status: 200 }
        );
      }
    } else {
      console.warn("[WEBHOOK] Missing metadata fields:", {
        userId: metadata?.userId,
        goal: metadata?.goal,
        level: metadata?.level,
        frequency: metadata?.frequency,
        tier: metadata?.tier
      });
    }
  }

  return new NextResponse("ok", { status: 200 });
}

