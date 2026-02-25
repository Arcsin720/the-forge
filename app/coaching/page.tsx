import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CoachingClient from "./CoachingClient";

export const dynamic = "force-dynamic";

export default async function CoachingPage({
  searchParams
}: {
  searchParams: { programId?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/signin?callbackUrl=/coaching");
  }

  const programId = searchParams.programId;

  // Si un programId est spécifié, vérifier que l'utilisateur le possède et qu'il est ELITE
  if (programId) {
    const program = await prisma.program.findFirst({
      where: {
        id: programId,
        user: { email: session.user.email },
        tier: "ELITE"
      }
    });

    if (!program) {
      redirect("/dashboard");
    }
  }

  return <CoachingClient />;
}

