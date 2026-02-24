import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema, validateInput } from "@/lib/validation";
import { checkRateLimit, getClientIp, tooManyRequests } from "@/lib/rateLimit";
import { logRegistration, logApiError } from "@/lib/analytics";

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  
  try {
    // Rate limiting: max 5 registrations par IP par 15 minutes
    if (!checkRateLimit(clientIp, "register", 5, 15 * 60 * 1000)) {
      console.warn(`[REGISTER] Rate limit exceeded for IP: ${clientIp}`);
      return tooManyRequests();
    }

    const body = await request.json();

    // Valider les inputs
    const validation = validateInput(registerSchema, body);
    if (!validation.valid) {
      console.warn("[REGISTER] Validation failed:", validation.error);
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Vérifier si l'utilisateur existe déjà
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.warn(`[REGISTER] User already exists: ${email}`);
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 400 }
      );
    }

    // Hasher le password et créer l'utilisateur
    const passwordHash = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash
      }
    });

    console.log(`[REGISTER] User created: ${user.id}`);

    // Log analytics
    logRegistration(user.email, clientIp);

    return NextResponse.json(
      {
        id: user.id,
        email: user.email
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[REGISTER] Error:", errorMsg);
    logApiError("register", errorMsg, clientIp);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}

