"use client";

import { PricingCard } from "@/components/PricingCard";
import { Card } from "@/components/Card";

const tiers: {
  id: "basic" | "pro" | "elite";
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    id: "basic",
    name: "BASIC",
    price: "39€",
    tagline: "Programme structuré, sans fioritures.",
    features: [
      "Plan d'entraînement complet 8–12 semaines",
      "Répartition personnalisée selon ton objectif",
      "Volume et intensité adaptés à ton niveau",
      "Format PDF/texte exploitable immédiatement"
    ]
  },
  {
    id: "pro",
    name: "PRO",
    price: "79€",
    tagline: "Programme + cadre nutrition & vidéos.",
    features: [
      "Tout BASIC",
      "Recommandations nutrition simples et actionnables",
      "Priorisation des exercices selon ton objectif",
      "Liens vers ressources et vidéos YouTube triées"
    ],
    highlighted: true
  },
  {
    id: "elite",
    name: "ELITE",
    price: "149€",
    tagline: "Pensé pour le suivi coaching et le tracking.",
    features: [
      "Tout PRO",
      "Structure optimisée pour suivi hebdo avec coach",
      "Métriques claires à suivre (charge, RPE, volume)",
      "Place pour notes et ajustements"
    ]
  }
] as const;

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12">
      {/* Hero section */}
      <section className="text-center space-y-4 mb-16">
        <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80 font-semibold">
          Nos offres
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Choisis le métal à frapper.
        </h1>
        <p className="mx-auto max-w-2xl text-sm md:text-base text-slate-400 leading-relaxed">
          Pas d&apos;abonnement, pas de bullshit. Tu choisis une offre, tu fais un court quiz, tu paies une fois, tu reçois ton programme construit autour de ta réalité.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="grid gap-6 md:gap-8 md:grid-cols-3 mb-16">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.id}
            id={tier.id}
            name={tier.name}
            price={tier.price}
            tagline={tier.tagline}
            features={tier.features}
            highlighted={tier.highlighted}
          />
        ))}
      </section>

      {/* Comparison table */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-wide mb-2">
            Comparaison détaillée
          </h2>
          <p className="text-xs text-slate-400">
            Vérифie tous les détails inclus dans chaque offre
          </p>
        </div>

        <Card variant="dark">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-forge-border/50">
                  <th className="px-4 py-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">
                    Inclut
                  </th>
                  {tiers.map((tier) => (
                    <th
                      key={tier.id}
                      className="px-4 py-4 font-semibold text-forge-accent text-xs uppercase tracking-wider text-center"
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Plan structuré 8–12 semaines",
                    basic: true,
                    pro: true,
                    elite: true
                  },
                  {
                    label: "Réglages selon ton objectif et niveau",
                    basic: true,
                    pro: true,
                    elite: true
                  },
                  {
                    label: "Cadre nutrition simplifié",
                    basic: false,
                    pro: true,
                    elite: true
                  },
                  {
                    label: "Liens YouTube triés",
                    basic: false,
                    pro: true,
                    elite: true
                  },
                  {
                    label: "Structure pensée pour suivi coaching",
                    basic: false,
                    pro: false,
                    elite: true
                  }
                ].map((row) => (
                  <tr key={row.label} className="border-b border-forge-border/30 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 text-slate-300 text-sm">{row.label}</td>
                    {[row.basic, row.pro, row.elite].map((included, idx) => (
                      <td key={idx} className="px-4 py-3 text-center">
                        {included ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-500/10 text-green-400">
                            ✓
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* FAQ section */}
      <section className="mt-16 space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-wide mb-2">Questions fréquentes</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              q: "Puis-je changer d'offre après achat ?",
              a: "Non, mais chaque programme est complet et autonome. Tu peux toujours en acheter un autre plus tard."
            },
            {
              q: "Et si je ne suis pas satisfait ?",
              a: "Bien sûr, tu as 14 jours pour demander un remboursement sans questions."
            },
            {
              q: "Combien de temps pour recevoir mon programme ?",
              a: "Instantanément après validation du paiement Stripe. Tu le reçois par email."
            },
            {
              q: "Peut-on personnaliser davantage ?",
              a: "Oui, des sessions de coaching 1-1 peuvent être réservées séparément."
            }
          ].map((faq) => (
            <Card key={faq.q} variant="default" padding="md">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-slate-100">{faq.q}</h3>
                <p className="text-xs text-slate-400">{faq.a}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
