import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    },
    include: {
      programs: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  const programs = user?.programs ?? [];
  const hasEliteProgram = programs.some((program) => program.tier === "ELITE");

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
          Espace membre
        </p>
        <h1 className="text-2xl font-semibold tracking-wide">
          Mes programmes forgés
        </h1>
        <p className="max-w-xl text-sm text-slate-400">
          Retrouve ici tous les programmes générés après tes paiements Stripe.
        </p>
      </header>

      {programs.length === 0 ? (
        <section className="rounded-xl border border-dashed border-forge-border bg-black/40 px-6 py-10 text-sm text-slate-300">
          <p className="text-base font-medium">
            Aucun programme forgé pour l&apos;instant.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Choisis une offre, passe le quiz, paie une fois via Stripe et ton
            premier programme apparaîtra ici.
          </p>
          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-full border border-forge-accent/70 bg-forge-accent px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black shadow-forgeGlow hover:brightness-105"
            >
              Voir les offres
            </Link>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <p>
              {programs.length === 1
                ? "1 programme disponible."
                : `${programs.length} programmes disponibles.`}
            </p>
            {hasEliteProgram && (
              <Link
                href="/coaching"
                className="inline-flex items-center rounded-full border border-forge-accent/60 bg-forge-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-forge-accent hover:bg-forge-accent/20"
              >
                Accéder au coaching ELITE
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {programs.map((program) => (
              <article
                key={program.id}
                className="flex flex-col gap-3 rounded-xl border border-forge-border bg-forge-surface/70 px-4 py-4 text-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      THE FORGE {program.tier}
                    </p>
                    {program.tier === "ELITE" && (
                      <span className="rounded-full border border-forge-accent/70 bg-forge-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-forge-accent">
                        ELITE
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-100">
                    Objectif {program.goal}
                  </p>
                  <p className="text-xs text-slate-400">
                    Niveau {program.level} • {program.frequency} séances / semaine
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Forgé le{" "}
                    {program.createdAt.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                </div>

                <div className="md:text-right">
                  <Link
                    href={`/program/${program.id}`}
                    className="inline-flex items-center rounded-full border border-forge-accent/70 bg-forge-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black shadow-forgeGlow hover:brightness-105"
                  >
                    Voir le programme
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

