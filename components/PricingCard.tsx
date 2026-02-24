import Link from "next/link";
import { Card } from "./Card";
import { Button } from "./Button";

export interface PricingCardProps {
  id: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
}

export function PricingCard({
  id,
  name,
  price,
  tagline,
  features,
  highlighted = false,
  ctaText = "Choisir l'offre"
}: PricingCardProps) {
  return (
    <Card
      variant={highlighted ? "highlight" : "default"}
      padding="lg"
      className={`relative flex flex-col gap-6 ${
        highlighted ? "ring-2 ring-forge-accent/40" : ""
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 right-6 rounded-full border border-forge-accent bg-forge-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black shadow-lg">
          ⭐ Recommandé
        </div>
      )}

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
          {name}
        </p>
        <p className="mt-3 text-3xl font-bold text-forge-accent">{price}</p>
        <p className="mt-2 text-xs text-slate-400">{tagline}</p>
      </div>

      <ul className="flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-1.5 flex-shrink-0 h-2 w-2 rounded-full bg-forge-accent" />
            <span className="text-xs text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={`/start?tier=${id}`} className="w-full">
        <Button variant="primary" size="md" fullWidth>
          {ctaText}
        </Button>
      </Link>
    </Card>
  );
}
