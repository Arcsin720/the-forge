"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const goals = ["Prise de masse", "Perte de graisse", "Force", "Performance"];
const levels = ["Débutant", "Intermédiaire", "Avancé"];
const frequencies = ["3", "4", "5"];

type Tier = "BASIC" | "PRO" | "ELITE";

export default function GeneratePage() {
  const router = useRouter();
  const [goal, setGoal] = useState(goals[0] ?? "");
  const [level, setLevel] = useState(levels[0] ?? "");
  const [frequency, setFrequency] = useState(frequencies[0] ?? "");
  const [tier, setTier] = useState<Tier>("BASIC");
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
        tier
      })
    });

    setLoading(false);

    if (!response.ok) {
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
    <main className="min-h-screen bg-forge-background px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
            Étape 1/2 - Profil
          </p>
          <h1 className="text-2xl font-semibold tracking-wide">
            Définis le cadre de ton programme
          </h1>
          <p className="max-w-xl text-sm text-slate-400">
            Cette étape permet à THE FORGE d&apos;adapter le plan à ta réalité:
            ton objectif, ton niveau actuel et le nombre de séances que tu peux
            vraiment tenir.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Objectif
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
              Niveau
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
              Fréquence
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

        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setTier("BASIC")}
            className={`border rounded-xl p-4 text-left text-sm bg-black/30 ${
              tier === "BASIC"
                ? "border-forge-accent"
                : "border-forge-border"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Tier
            </p>
            <p className="mt-1 font-semibold">BASIC</p>
            <p className="mt-1 text-xs text-slate-300">
              Programme structuré, sans bloc nutrition ni liens vidéos.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTier("PRO")}
            className={`border rounded-xl p-4 text-left text-sm bg-black/30 ${
              tier === "PRO" ? "border-forge-accent" : "border-forge-border"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Tier
            </p>
            <p className="mt-1 font-semibold">PRO</p>
            <p className="mt-1 text-xs text-slate-300">
              Programme + cadre nutritionnel et recommandations vidéos.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setTier("ELITE")}
            className={`border rounded-xl p-4 text-left text-sm bg-black/30 ${
              tier === "ELITE"
                ? "border-forge-accent"
                : "border-forge-border"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Tier
            </p>
            <p className="mt-1 font-semibold">ELITE</p>
            <p className="mt-1 text-xs text-slate-300">
              Tout PRO + focus sur le tracking pour ton suivi coaching.
            </p>
          </button>
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
            {loading ? "Redirection..." : "Aller au paiement"}
          </button>
        </div>
      </div>
    </main>
  );
}
