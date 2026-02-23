"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();

  function handleStrike() {
    if (status === "authenticated") {
      router.push("/start?tier=pro");
    } else {
      router.push(
        "/auth/signin?callbackUrl=" + encodeURIComponent("/start?tier=pro")
      );
    }
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-16 pt-10 md:flex-row md:items-center">
      <section className="flex-1 space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
              Programmes sur-mesure
            </p>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Forge ton programme
              <span className="text-forge-accent">. Sans bullshit.</span>
            </h1>
            <p className="max-w-xl text-sm text-slate-400">
              THE FORGE construit un plan d'entraînement premium autour de
              ton objectif, de ton niveau et de ton rythme réel. Tu paies une
              fois, tu repars avec un programme complet et actionnable.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-3">
            <div className="rounded-lg border border-forge-border bg-black/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                1. Choisis
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Objectif, niveau, fréquence. La forge se cale sur ta réalité.
              </p>
            </div>
            <div className="rounded-lg border border-forge-border bg-black/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                2. Paie
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Paiement sécurisé via Stripe. Pas d&apos;abonnement, pas de piège.
              </p>
            </div>
            <div className="rounded-lg border border-forge-border bg-black/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                3. Reçois
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Programme structuré (+ nutrition et vidéos selon le tier choisi).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleStrike}
              className="group relative inline-flex items-center gap-2 rounded-full border border-forge-accent/70 bg-forge-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-forgeGlow transition-transform duration-150 hover:-translate-y-0.5"
            >
              <span className="h-2 w-2 rounded-full bg-black/70 group-hover:scale-125 transition-transform" />
              Choisir l&apos;offre PRO
            </button>

            <Link
              href="/pricing"
              className="text-xs text-slate-300 underline-offset-4 hover:text-forge-accentSoft hover:underline"
            >
              Voir les offres
            </Link>
          </div>
        </section>

        <section className="flex-1">
          <div className="relative mx-auto h-64 max-w-md rounded-2xl border border-forge-border/80 bg-gradient-to-br from-slate-900/80 via-black to-slate-950/90 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <div className="pointer-events-none absolute -top-10 right-10 h-24 w-24 rounded-full bg-forge-accent/20 blur-3xl" />
            <div className="flex h-full flex-col justify-between p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Aperçu
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  THE FORGE – Tier PRO
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Objectif: recomposition corporelle • 4 séances / semaine
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <p>• Bloc activation: mobilité + gainage</p>
                <p>• Bloc force: 3–5 séries lourdes sur les fondamentaux</p>
                <p>• Bloc volume: 2–4 exercices ciblés selon ton objectif</p>
                <p>• Bloc finish: travail cardio / métabolique court</p>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Inclut recommandations nutrition + liens YouTube</span>
                <span className="rounded-full border border-forge-accent/40 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-forge-accent">
                  Exemple
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
