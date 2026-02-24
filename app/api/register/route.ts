import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { registerSchema, validateInput } from "@/lib/validation";

export async function POST(request: Request) {
  try {
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

    return NextResponse.json(
      {
        id: user.id,
        email: user.email
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}

