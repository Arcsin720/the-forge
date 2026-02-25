import Link from "next/link";

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
      "Plan d’entraînement complet 8–12 semaines",
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
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-10">
      <section className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
          Offres
        </p>
        <h1 className="text-3xl font-semibold">
          Choisis le métal à frapper.
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-400">
          Pas d’abonnement, pas de bullshit. Tu choisis un tier, tu passes un
          court quiz, tu paies une fois, tu reçois ton programme construit autour
          de ta réalité.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative flex flex-col rounded-2xl border bg-black/50 p-5 text-sm ${
              tier.highlighted
                ? "border-forge-accent/80 shadow-forgeGlow"
                : "border-forge-border"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 right-4 rounded-full border border-forge-accent/80 bg-forge-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black">
                Recommandé
              </div>
            )}
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              {tier.name}
            </p>
            <p className="mt-2 text-2xl font-semibold">{tier.price}</p>
            <p className="mt-1 text-xs text-slate-300">{tier.tagline}</p>

            <ul className="mt-4 flex-1 space-y-2 text-xs text-slate-300">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-forge-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/start?tier=${tier.id}`}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-forge-accent/70 bg-forge-accent px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black shadow-forgeGlow hover:brightness-105"
            >
              Choisir l&apos;offre
            </Link>
          </div>
        ))}
      </section>

      <section className="mt-10 space-y-4 text-[11px] text-slate-400">
        <h2 className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">
          Comparaison rapide
        </h2>
        <div className="overflow-x-auto rounded-xl border border-forge-border bg-black/40">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-forge-border/70 text-[11px] text-slate-300">
                <th className="px-4 py-3 font-normal">Inclut</th>
                <th className="px-4 py-3 font-normal">BASIC</th>
                <th className="px-4 py-3 font-normal">PRO</th>
                <th className="px-4 py-3 font-normal">ELITE</th>
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
                  label: "Réglages selon ton objectif et ton niveau",
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
                  label: "Structure pensée pour le suivi coaching",
                  basic: false,
                  pro: false,
                  elite: true
                }
              ].map((row) => (
                <tr key={row.label} className="border-b border-forge-border/40">
                  <td className="px-4 py-3">{row.label}</td>
                  {[row.basic, row.pro, row.elite].map((value, index) => (
                    <td key={index} className="px-4 py-3">
                      {value ? (
                        <span className="inline-block h-2 w-2 rounded-full bg-forge-accent" />
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
      </section>
    </main>
  );
}
