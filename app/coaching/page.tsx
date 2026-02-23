import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CoachingPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/signin?callbackUrl=/coaching");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    },
    include: {
      programs: true
    }
  });

  const hasEliteProgram = user?.programs.some(
    (program) => program.tier === "ELITE"
  );

  if (!hasEliteProgram) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen bg-forge-background px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Coaching
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-wide">
            Suivi THE FORGE ELITE
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Espace réservé aux programmes ELITE pour loguer tes séances et ton
            ressenti.
          </p>
        </div>

        <section className="border border-forge-border bg-forge-surface/70 rounded-xl p-5 text-sm text-slate-400">
          <p>
            La structure de tracking détaillée sera branchée ici. En attendant,
            tu peux utiliser ton programme ELITE et prendre des notes après
            chaque séance (charge, RPE, énergie, sommeil).
          </p>
        </section>
      </div>
    </main>
  );
}

