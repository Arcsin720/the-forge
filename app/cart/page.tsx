"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart, getTierPrice, getTierDescription } from "@/lib/cart";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [cart] = useState(getCart());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (!cart) {
      router.push("/pricing");
    }
  }, [cart, router]);

  if (!cart) {
    return null;
  }

  const price = getTierPrice(cart.tier);

  async function handleCheckout() {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!agreeTerms) {
      setError("Tu dois accepter les conditions d'utilisation");
      return;
    }

    if (!cart) {
      setError("Le panier est vide");
      return;
    }

    setLoading(true);

    try {
      // Faire le checkout avec email/password
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: cart.goal,
          level: cart.level,
          frequency: cart.frequency,
          tier: cart.tier,
          email,
          password
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "Erreur lors du paiement");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { url?: string };
      if (data.url) {
        clearCart();
        router.push(data.url);
      } else {
        setError("Réponse invalide du serveur");
        setLoading(false);
      }
    } catch {
      setError("Erreur lors du paiement");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
          Étape 2/2
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-wide">
          Valide ton panier.
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Résumé du panier */}
        <div className="space-y-6 border border-forge-border rounded-xl bg-black/40 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Résumé de ta forge
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Objectif :</span>
                <span className="font-semibold">{cart.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Niveau :</span>
                <span className="font-semibold">{cart.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Fréquence :</span>
                <span className="font-semibold">{cart.frequency}x / semaine</span>
              </div>
              <div className="border-t border-forge-border my-3 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Offre :</span>
                  <span className="font-semibold text-forge-accent">
                    {cart.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {getTierDescription(cart.tier)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-forge-border pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold">Total :</span>
              <span className="text-2xl font-bold text-forge-accent">
                ${price}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                clearCart();
                router.push(`/start?tier=${cart.tier.toLowerCase()}`);
              }}
              className="w-full px-4 py-2 text-xs border border-forge-border rounded-lg hover:bg-white/5 transition-colors"
            >
              Modifier
            </button>
          </div>
        </div>

        {/* Formulaire création compte */}
        <div className="space-y-4 border border-forge-border rounded-xl bg-black/40 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Crée ton compte
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Création du compte + paiement sécurisé via Stripe
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-black/60 border border-forge-border text-sm focus:outline-none focus:border-forge-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 caractères, 1 majuscule, 1 chiffre"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-black/60 border border-forge-border text-sm focus:outline-none focus:border-forge-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">
                Confirme le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmation"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-black/60 border border-forge-border text-sm focus:outline-none focus:border-forge-accent"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                J&apos;accepte les{" "}
                <Link href="/terms" className="text-forge-accent hover:underline">
                  conditions d&apos;utilisation
                </Link>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleCheckout}
            className="w-full px-4 py-3 rounded-lg bg-forge-accent text-black text-xs font-semibold tracking-[0.2em] uppercase disabled:opacity-60 hover:bg-forge-accentSoft transition-colors"
          >
            {loading ? "Redirection vers Stripe..." : "Passer au paiement"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Paiement 100% sécurisé via Stripe
          </p>
        </div>
      </div>
    </main>
  );
}
