"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart, getTierPrice, getTierDescription } from "@/lib/cart";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import { Card } from "@/components/Card";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [cart] = useState(getCart());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
    // Validation
    if (!email || !password || !confirmPassword) {
      addToast("Tous les champs sont obligatoires", "error");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Min 8 caractères");
      addToast("Mot de passe trop court", "error");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError("Besoin d'une majuscule");
      addToast("Ajoute une majuscule à ton mot de passe", "error");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setPasswordError("Besoin d'un chiffre");
      addToast("Ajoute un chiffre à ton mot de passe", "error");
      return;
    }

    if (password !== confirmPassword) {
      addToast("Les mots de passe ne correspondent pas", "error");
      return;
    }

    if (!agreeTerms) {
      addToast("Tu dois accepter les conditions d'utilisation", "error");
      return;
    }

    if (!cart) {
      addToast("Le panier est vide", "error");
      return;
    }

    setLoading(true);

    try {
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
        addToast(data?.error ?? "Erreur lors du paiement", "error");
        setLoading(false);
        return;
      }

      const data = (await response.json()) as { url?: string };
      if (data.url) {
        addToast("Redirection vers Stripe...", "info");
        clearCart();
        router.push(data.url);
      } else {
        addToast("Réponse invalide du serveur", "error");
        setLoading(false);
      }
    } catch {
      addToast("Erreur lors du paiement", "error");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
          Étape 2/2
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-wide">
          Valide ton panier.
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Résumé du panier */}
        <Card variant="default">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">
                Résumé de ta forge
              </p>
              <div className="space-y-3 text-sm">
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
                  <p className="text-xs text-slate-400 mt-2">
                    {getTierDescription(cart.tier)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-forge-border pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold">Total :</span>
                <span className="text-3xl font-bold text-forge-accent">
                  ${price}
                </span>
              </div>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  clearCart();
                  router.push(`/start?tier=${cart.tier.toLowerCase()}`);
                }}
              >
                Modifier
              </Button>
            </div>
          </div>
        </Card>

        {/* Formulaire création compte */}
        <Card variant="highlight">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-forge-accent mb-2">
                Crée ton compte
              </p>
              <p className="text-xs text-slate-400">
                Création du compte + paiement sécurisé via Stripe
              </p>
            </div>

            <div className="space-y-4">
              <FormInput
                type="email"
                label="Email"
                placeholder="toi@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <FormInput
                type="password"
                label="Mot de passe"
                placeholder="Min 8 caractères, 1 majuscule, 1 chiffre"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                }}
                error={passwordError || undefined}
                hint="8+ caractères, majuscule et chiffre"
              />

              <FormInput
                type="password"
                label="Confirme le mot de passe"
                placeholder="Confirmation"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded accent-forge-accent"
                />
                <label htmlFor="terms" className="text-xs text-slate-400">
                  J&apos;accepte les{" "}
                  <Link href="/terms" className="text-forge-accent hover:underline">
                    conditions d&apos;utilisation
                  </Link>
                </label>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              onClick={handleCheckout}
            >
              Passer au paiement
            </Button>

            <p className="text-xs text-slate-400 text-center">
              🔒 Paiement 100% sécurisé via Stripe
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
