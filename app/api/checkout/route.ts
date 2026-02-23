import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { ProgramInput } from "@/lib/programGenerator";

type CheckoutBody = ProgramInput;

function getPriceId(tier: CheckoutBody["tier"]) {
  const map: Record<CheckoutBody["tier"], string | undefined> = {
    BASIC: process.env.STRIPE_PRICE_BASIC,
    PRO: process.env.STRIPE_PRICE_PRO,
    ELITE: process.env.STRIPE_PRICE_ELITE
  };

  const priceId = map[tier];

  if (!priceId) {
    throw new Error("Price ID is not configured for this tier");
  }

  return priceId;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await request.json()) as CheckoutBody;

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

  const priceId = getPriceId(body.tier);

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const tierParam = body.tier.toLowerCase();

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
      goal: body.goal,
      level: body.level,
      frequency: body.frequency,
      tier: body.tier
    }
  });

  return NextResponse.json(
    {
      url: stripeSession.url
    },
    { status: 201 }
  );
}

