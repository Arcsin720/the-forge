"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCart } from "@/lib/cart";

const goals = ["Prise de masse", "Perte de graisse", "Force", "Performance"];
const levels = ["Débutant", "Intermédiaire", "Avancé"];
const frequencies = ["3", "4", "5"];

type Tier = "BASIC" | "PRO" | "ELITE";

const tierLabels: Record<Tier, string> = {
  BASIC: "BASIC",
  PRO: "PRO",
  ELITE: "ELITE"
};

export default function StartClient(props: { tier: Tier }) {
  const router = useRouter();
  const [goal, setGoal] = useState(goals[0] ?? "");
  const [level, setLevel] = useState(levels[0] ?? "");
  const [frequency, setFrequency] = useState(frequencies[0] ?? "");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger et sauvegarder la progression dans localStorage
  useEffect(() => {
    const saved = localStorage.getItem("quiz-progress");
    if (saved) {
      try {
        const { goal: savedGoal, level: savedLevel, frequency: savedFrequency, step: savedStep } = JSON.parse(saved);
        setGoal(savedGoal || goals[0]);
        setLevel(savedLevel || levels[0]);
        setFrequency(savedFrequency || frequencies[0]);
        setStep(savedStep || 0);
      } catch {
        // Si parsing échoue, on garde les defaults
      }
    }
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    localStorage.setItem("quiz-progress", JSON.stringify({ goal, level, frequency, step }));
  }, [goal, level, frequency, step]);

  function handleContinue() {
    setLoading(true);
    setError(null);

    if (!goal || !level || !frequency) {
      setError("Merci de compléter toutes les étapes.");
      setLoading(false);
      return;
    }

    try {
      // Sauvegarder le panier
      setCart({
        goal,
        level,
        frequency,
        tier: props.tier
      });

      // Supprimer la progression du localStorage
      localStorage.removeItem("quiz-progress");

      // Aller au panier
      router.push("/cart");
    } catch {
      setError("Erreur lors de la sauvegarde");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
            Étape {step + 1}/3
          </p>
          <span className="text-xs text-slate-500">2 min</span>
        </div>
        <div className="h-2 w-full rounded-full bg-forge-border/60">
          <div
            className="h-2 rounded-full bg-forge-accent transition-all"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Configure ton programme.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Réponds à ces 3 questions pour générer un programme sur-mesure.
            Tu passes ensuite au paiement sécurisé Stripe.
          </p>
        </div>

        <div className="rounded-xl border border-forge-accent/60 bg-forge-accent/10 px-4 py-3 text-xs text-forge-accent">
          <p className="uppercase tracking-[0.24em] text-[11px]">
            Offre choisie
          </p>
          <p className="mt-1 text-sm font-semibold">
            {tierLabels[props.tier]}
          </p>
          <button
            type="button"
            onClick={() => router.push("/pricing")}
            className="mt-2 text-[11px] text-forge-accentSoft underline-offset-4 hover:underline"
          >
            Changer d&apos;offre
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-forge-border bg-forge-surface/70 p-6 space-y-6">
          {step === 0 && (
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Objectif principal
                </p>
                <p className="text-xs text-slate-500">Choisis ta priorité numéro 1</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {goals.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGoal(value)}
                    className={`px-3 py-2 rounded-full text-xs border transition-colors ${
                      goal === value
                        ? "border-forge-accent bg-forge-accent/10 text-forge-accent"
                        : "border-forge-border bg-black/30 text-slate-300 hover:border-forge-accent/50"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Niveau actuel
                </p>
                <p className="text-xs text-slate-500">Ajuste la difficulté</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {levels.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLevel(value)}
                    className={`px-3 py-2 rounded-full text-xs border transition-colors ${
                      level === value
                        ? "border-forge-accent bg-forge-accent/10 text-forge-accent"
                        : "border-forge-border bg-black/30 text-slate-300 hover:border-forge-accent/50"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Fréquence hebdo
                </p>
                <p className="text-xs text-slate-500">Nombre de séances / semaine</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {frequencies.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFrequency(value)}
                    className={`px-3 py-2 rounded-full text-xs border transition-colors ${
                      frequency === value
                        ? "border-forge-accent bg-forge-accent/10 text-forge-accent"
                        : "border-forge-border bg-black/30 text-slate-300 hover:border-forge-accent/50"
                    }`}
                  >
                    {value}x / semaine
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              className="text-xs text-slate-400 hover:text-slate-200"
              disabled={step === 0}
            >
              ← Retour
            </button>
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.min(2, prev + 1))}
                className="text-xs text-forge-accent hover:text-forge-accentSoft"
              >
                Suivant →
              </button>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-forge-border bg-black/40 p-4 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Résumé
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Objectif</span>
              <span className="text-slate-200 font-semibold">{goal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Niveau</span>
              <span className="text-slate-200 font-semibold">{level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fréquence</span>
              <span className="text-slate-200 font-semibold">{frequency}x</span>
            </div>
          </div>
          <div className="border-t border-forge-border/60 pt-3 text-xs text-slate-500">
            Ton programme sera généré sur mesure selon ces critères.
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          disabled={loading || step < 2}
          onClick={handleContinue}
          className="px-8 py-3 rounded-full bg-forge-accent text-black text-xs font-semibold tracking-[0.2em] uppercase disabled:opacity-60"
        >
          {loading ? "Chargement..." : "Voir mon panier"}
        </button>
        <p className="text-xs text-slate-500">
          Étape suivante : paiement sécurisé Stripe
        </p>
      </div>
    </main>
  );
}

