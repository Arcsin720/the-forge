"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCart } from "@/lib/cart";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

const goals = ["Prise de masse", "Perte de graisse", "Force", "Performance"];
const levels = ["Débutant", "Intermédiaire", "Avancé"];
const frequencies = ["3", "4", "5"];

type Tier = "BASIC" | "PRO" | "ELITE";

const tierLabels: Record<Tier, string> = {
  BASIC: "BASIC",
  PRO: "PRO",
  ELITE: "ELITE"
};

interface QuizOptionProps {
  selected: boolean;
  onClick: () => void;
  label: string;
}

function QuizOption({ selected, onClick, label }: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-xs font-semibold tracking-widest uppercase
        border transition-all duration-200
        ${
          selected
            ? "border-forge-accent bg-forge-accent/20 text-forge-accent"
            : "border-forge-border bg-black/30 text-slate-300 hover:border-forge-accent/50"
        }
      `}
    >
      {label}
    </button>
  );
}

export default function StartClient(props: { tier: Tier }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [goal, setGoal] = useState(goals[0] ?? "");
  const [level, setLevel] = useState(levels[0] ?? "");
  const [frequency, setFrequency] = useState(frequencies[0] ?? "");
  const [loading, setLoading] = useState(false);

  function handleContinue() {
    setLoading(true);

    try {
      setCart({
        goal,
        level,
        frequency,
        tier: props.tier
      });

      addToast("Configuration sauvegardée !", "success");
      router.push("/cart");
    } catch {
      addToast("Erreur lors de la sauvegarde", "error");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
            Étape 1/2
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-wide">
            Configure ton programme.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-400">
            Quelques questions rapides pour adapter THE FORGE à ton contexte
            réel. Tu pourras revoir tes choix avant le paiement.
          </p>
        </div>

        <Card variant="highlight" padding="md">
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-forge-accent font-semibold">
                Offre choisie
              </p>
              <p className="mt-2 text-lg font-bold text-forge-accent">
                {tierLabels[props.tier]}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/pricing")}
              fullWidth
            >
              Changer d&apos;offre
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card variant="default">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
              🎯 Objectif
            </p>
            <div className="space-y-2">
              {goals.map((value) => (
                <QuizOption
                  key={value}
                  label={value}
                  selected={goal === value}
                  onClick={() => setGoal(value)}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
              📈 Niveau
            </p>
            <div className="space-y-2">
              {levels.map((value) => (
                <QuizOption
                  key={value}
                  label={value}
                  selected={level === value}
                  onClick={() => setLevel(value)}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
              ⏰ Fréquence
            </p>
            <div className="space-y-2">
              {frequencies.map((value) => (
                <QuizOption
                  key={value}
                  label={`${value}x / semaine`}
                  selected={frequency === value}
                  onClick={() => setFrequency(value)}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="primary"
          size="lg"
          isLoading={loading}
          onClick={handleContinue}
        >
          Voir mon panier
        </Button>
      </div>
    </main>
  );
}

