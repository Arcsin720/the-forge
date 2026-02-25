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
      include: {
        accounts: true,
        programs: {
          select: {
            id: true,
            tier: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculer les stats
    const totalPrograms = user.programs.length;
    const activePrograms = user.programs.filter(p => {
      const createdAt = new Date(p.createdAt);
      const now = new Date();
      const daysSince = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 90; // Considérer comme actif si créé il y a moins de 90 jours
    }).length;
    const completedPrograms = totalPrograms - activePrograms;

    // Compter les sessions de coaching ELITE
    const totalSessions = await prisma.programTracking.count({
      where: {
        program: {
          userId: user.id,
          tier: "ELITE"
        }
      }
    });

    return NextResponse.json({
      totalPrograms,
      activePrograms,
      completedPrograms,
      totalSessions
    });
  } catch (error) {
    console.error("[DASHBOARD STATS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
