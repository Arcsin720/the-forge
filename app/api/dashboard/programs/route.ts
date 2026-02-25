import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Récupérer tous les programmes de l'utilisateur
    const programs = await prisma.program.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        tier: true,
        goal: true,
        level: true,
        frequency: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    // Convertir frequency en nombre
    const formattedPrograms = programs.map(p => ({
      ...p,
      frequency: parseInt(p.frequency),
      name: `Programme ${p.tier}`
    }));

    return NextResponse.json(formattedPrograms);
  } catch (error) {
    console.error("[DASHBOARD PROGRAMS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
