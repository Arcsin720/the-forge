import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcrypt";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { checkoutSchema, validateInput } from "@/lib/validation";
import { env } from "@/lib/env";
import { checkRateLimit, getClientIp, tooManyRequests } from "@/lib/rateLimit";
import { logCheckoutInitiated, logApiError } from "@/lib/analytics";

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
  const clientIp = getClientIp(request);
  
  try {
    // Rate limiting: max 10 checkouts par IP par heure
    if (!checkRateLimit(clientIp, "checkout", 10, 60 * 60 * 1000)) {
      console.warn(`[CHECKOUT] Rate limit exceeded for IP: ${clientIp}`);
      return tooManyRequests();
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
    let userEmail: string;
    let userId: string;

    // Cas 1 : Utilisateur authentifié (ancien flow)
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userEmail = session.user.email;
      
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (!user) {
        return NextResponse.json(
          { error: "Utilisateur introuvable" },
          { status: 404 }
        );
      }

      userId = user.id;
    }
    // Cas 2 : Guest checkout avec création de compte (nouveau flow)
    else if (validatedData.email && validatedData.password) {
      userEmail = validatedData.email;

      // Vérifier si l'email existe déjà
      const existing = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (existing) {
        return NextResponse.json(
          { error: "Un compte existe déjà avec cet email" },
          { status: 400 }
        );
      }

      // Créer le compte
      const passwordHash = await hash(validatedData.password, 10);
      const newUser = await prisma.user.create({
        data: {
          email: userEmail,
          passwordHash,
          name: null
        }
      });

      userId = newUser.id;
      console.log(`[CHECKOUT] New user created: ${userId}`);
    }
    // Cas 3 : Ni session, ni email/password
    else {
      return NextResponse.json(
        { error: "Non authentifié ou données manquantes" },
        { status: 401 }
      );
    }

    const priceId = getPriceId(validatedData.tier);
    const origin = env.NEXT_PUBLIC_APP_URL;

    console.log(`[CHECKOUT] Creating session for user: ${userId}, tier: ${validatedData.tier}`);

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
      cancel_url: `${origin}/cart`,
      metadata: {
        userId,
        goal: validatedData.goal,
        level: validatedData.level,
        frequency: validatedData.frequency,
        tier: validatedData.tier,
        userEmail
      }
    });

    console.log(`[CHECKOUT] Session created: ${stripeSession.id}`);

    // Log analytics
    logCheckoutInitiated(userEmail, clientIp, validatedData.tier, validatedData.goal);

    return NextResponse.json(
      {
        url: stripeSession.url
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[CHECKOUT] Error:", errorMsg);
    logApiError("checkout", errorMsg, clientIp);
    return NextResponse.json(
      { error: "Erreur lors du paiement" },
      { status: 500 }
    );
  }
}

