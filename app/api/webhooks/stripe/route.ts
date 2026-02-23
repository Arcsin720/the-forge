import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { createProgramForUser } from "@/lib/programs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new NextResponse("Missing configuration", { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata;

    if (
      session.id &&
      metadata &&
      metadata.userId &&
      metadata.goal &&
      metadata.level &&
      metadata.frequency &&
      metadata.tier
    ) {
      const existing = await prisma.program.findUnique({
        where: {
          stripeCheckoutId: session.id
        }
      });

      if (!existing) {
        await createProgramForUser(
          metadata.userId,
          {
            goal: metadata.goal,
            level: metadata.level,
            frequency: metadata.frequency,
            tier: metadata.tier as "BASIC" | "PRO" | "ELITE"
          },
          session.id
        );
      }
    }
  }

  return new NextResponse("ok", { status: 200 });
}

