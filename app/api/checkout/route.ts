import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutSchema, validateInput } from "@/lib/validation";
import { env } from "@/lib/env";

function getPriceId(tier: "BASIC" | "PRO" | "ELITE") {
  const map: Record<"BASIC" | "PRO" | "ELITE", string> = {
    BASIC: env.STRIPE_PRICE_BASIC,
    PRO: env.STRIPE_PRICE_PRO,
    ELITE: env.STRIPE_PRICE_ELITE
  };

  const priceId = map[tier];

  if (!priceId) {
    throw new Error("Price ID is not configured for this tier");
  }

  return priceId;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Valider les inputs
    const validation = validateInput(checkoutSchema, body);
    if (!validation.valid) {
      console.warn("[CHECKOUT] Validation failed:", validation.error);
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    const priceId = getPriceId(validatedData.tier);

    const origin = env.NEXT_PUBLIC_APP_URL;

    const tierParam = validatedData.tier.toLowerCase();

    console.log(`[CHECKOUT] Creating session for user: ${user.id}, tier: ${validatedData.tier}`);

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${origin}/program/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/start?tier=${tierParam}`,
      metadata: {
        userId: user.id,
        goal: validatedData.goal,
        level: validatedData.level,
        frequency: validatedData.frequency,
        tier: validatedData.tier,
        userEmail: user.email
      }
    });

    console.log(`[CHECKOUT] Session created: ${stripeSession.id}`);

    return NextResponse.json(
      {
        url: stripeSession.url
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CHECKOUT] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors du paiement" },
      { status: 500 }
    );
  }
}

