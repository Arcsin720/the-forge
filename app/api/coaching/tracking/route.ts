import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const programId = searchParams.get("programId");

    if (!programId) {
      return NextResponse.json(
        { error: "programId est requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur possède ce programme et qu'il est ELITE
    const program = await prisma.program.findFirst({
      where: {
        id: programId,
        user: { email: session.user.email },
        tier: "ELITE"
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Récupérer le suivi pour ce programme
    const tracking = await prisma.programTracking.findMany({
      where: { programId },
      orderBy: { week: "asc" }
    });

    return NextResponse.json(tracking);
  } catch (error) {
    console.error("[COACHING TRACKING] GET error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
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
    const { programId, week, energyLevel, soreness, motivation, adherenceRate, nutritionQuality, notes } = body;

    // Valider les données
    if (!programId || !week) {
      return NextResponse.json(
        { error: "programId et week sont requis" },
        { status: 400 }
      );
    }

    if (!energyLevel || !soreness || !motivation || adherenceRate === undefined || !nutritionQuality) {
      return NextResponse.json(
        { error: "Tous les champs d'évaluation sont requis" },
        { status: 400 }
      );
    }

    // Valider les ranges
    if (energyLevel < 1 || energyLevel > 10 || soreness < 1 || soreness > 10 || 
        motivation < 1 || motivation > 10 || adherenceRate < 0 || adherenceRate > 100 ||
        nutritionQuality < 1 || nutritionQuality > 10) {
      return NextResponse.json(
        { error: "Les valeurs doivent respecter les plages définies" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur possède ce programme et qu'il est ELITE
    const program = await prisma.program.findFirst({
      where: {
        id: programId,
        user: { email: session.user.email },
        tier: "ELITE"
      }
    });

    if (!program) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier qu'on n'a pas déjà un suivi pour cette semaine
    const existing = await prisma.programTracking.findUnique({
      where: {
        programId_week: {
          programId,
          week
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un suivi existe déjà pour cette semaine" },
        { status: 409 }
      );
    }

    // Créer le suivi
    const tracking = await prisma.programTracking.create({
      data: {
        programId,
        week,
        energyLevel,
        soreness,
        motivation,
        adherenceRate,
        nutritionQuality,
        notes: notes || null
      }
    });

    return NextResponse.json(tracking);
  } catch (error) {
    console.error("[COACHING TRACKING] POST error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
