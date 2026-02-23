"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goal,
        level,
        frequency,
        tier: props.tier
      })
    });

    setLoading(false);

    if (!response.ok) {
      if (response.status === 401) {
        const params = new URLSearchParams({
          callbackUrl: `/start?tier=${props.tier.toLowerCase()}`
        });
        window.location.href = `/auth/signin?${params.toString()}`;
        return;
      }

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      setError(
        data?.error ?? "Impossible de lancer la forge, réessaie plus tard."
      );
      return;
    }

    const data = (await response.json()) as { url?: string };

    if (data.url) {
      router.push(data.url);
    } else {
      setError("Réponse Stripe invalide");
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
            Étape 1/2
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-wide">
            Configure ton programme.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Quelques questions rapides pour adapter THE FORGE à ton contexte
            réel. Tu pourras ensuite passer au paiement sécurisé Stripe.
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

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Objectif principal
          </p>
          <div className="flex flex-wrap gap-2">
            {goals.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setGoal(value)}
                className={`px-3 py-2 rounded-full text-xs border ${
                  goal === value
                    ? "border-forge-accent bg-forge-accent/10"
                    : "border-forge-border bg-black/30"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Niveau actuel
          </p>
          <div className="flex flex-wrap gap-2">
            {levels.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLevel(value)}
                className={`px-3 py-2 rounded-full text-xs border ${
                  level === value
                    ? "border-forge-accent bg-forge-accent/10"
                    : "border-forge-border bg-black/30"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Fréquence hebdo
          </p>
          <div className="flex flex-wrap gap-2">
            {frequencies.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFrequency(value)}
                className={`px-3 py-2 rounded-full text-xs border ${
                  frequency === value
                    ? "border-forge-accent bg-forge-accent/10"
                    : "border-forge-border bg-black/30"
                }`}
              >
                {value}x / semaine
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={handleCheckout}
          className="px-8 py-3 rounded-full bg-forge-accent text-black text-xs font-semibold tracking-[0.2em] uppercase disabled:opacity-60"
        >
          {loading ? "Redirection..." : "Passer au paiement"}
        </button>
      </div>
    </main>
  );
}

