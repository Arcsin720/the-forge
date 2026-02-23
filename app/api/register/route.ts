import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name } = body as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email" },
      { status: 400 }
    );
  }

  const passwordHash = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: name ?? null,
      passwordHash
    }
  });

  return NextResponse.json(
    {
      id: user.id,
      email: user.email
    },
    { status: 201 }
  );
}

