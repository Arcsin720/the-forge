"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCart, clearCart, getTierPrice, getTierDescription } from "@/lib/cart";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import { Card } from "@/components/Card";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";

export default function CartClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addToast } = useToast();
  const [cart, setCart] = useState(getCart());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Charger le panier depuis localStorage
  useEffect(() => {
    const cartData = getCart();
    if (!cartData) {
      setCart(null);
    } else {
      setCart(cartData);
    }
  }, [router]);

  // Pré-remplir l'email si connecté
  useEffect(() => {
    if (session?.user?.email && !email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email, email]);

  if (!cart) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
            Panier
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-wide">
            Ton panier est vide.
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Choisis une offre pour commencer ta forge.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" onClick={() => router.push("/pricing")}
            >Voir les offres</Button>
          <Button variant="outline" onClick={() => router.push("/start?tier=pro")}
            >Démarrer un programme</Button>
        </div>
      </main>
    );
  }

  // Afficher un spinner pendant le chargement de la session
  if (status === "loading") {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-10 flex items-center justify-center min-h-screen">
        <Spinner />
      </main>
    );
  }

  const price = getTierPrice(cart.tier);
  const isAuthenticated = !!session?.user?.email;

  async function handleCheckout() {
    if (!cart) {
      addToast("Le panier est vide", "error");
      return;
    }

    setLoading(true);

    // Si connecté, envoyer sans password
    if (isAuthenticated) {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal: cart.goal,
            level: cart.level,
            frequency: cart.frequency,
            tier: cart.tier
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
      return;
    }

    // Sinon, valider le formulaire de création de compte
    if (!email || !password || !confirmPassword) {
      addToast("Tous les champs sont obligatoires", "error");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError("Min 8 caractères");
      addToast("Mot de passe trop court", "error");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError("Besoin d'une majuscule");
      addToast("Ajoute une majuscule à ton mot de passe", "error");
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(password)) {
      setPasswordError("Besoin d'un chiffre");
      addToast("Ajoute un chiffre à ton mot de passe", "error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      addToast("Les mots de passe ne correspondent pas", "error");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      addToast("Tu dois accepter les conditions d'utilisation", "error");
      setLoading(false);
      return;
    }

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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    clearCart();
                    setCart(null);
                    addToast("Panier vidé", "info");
                  }}
                >
                  Vider le panier
                </Button>
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
          </div>
        </Card>

        {/* Formulaire création compte ou paiement rapide */}
        <Card variant="highlight">
          <div className="space-y-6">
            {isAuthenticated ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-forge-accent mb-2">
                    Bienvenue
                  </p>
                  <p className="text-sm">
                    Tu es connecté en tant que{" "}
                    <span className="font-semibold text-forge-accent">
                      {session?.user?.email}
                    </span>
                  </p>
                </div>

                <div className="border-t border-forge-border pt-4">
                  <p className="text-xs text-slate-400 mb-4">
                    Clique sur le bouton ci-dessous pour confirmer ton achat et accéder au paiement sécurisé Stripe.
                  </p>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={loading}
                    onClick={handleCheckout}
                  >
                    Confirmer et passer au paiement
                  </Button>

                  <p className="text-xs text-slate-400 text-center mt-4">
                    🔒 Paiement 100% sécurisé via Stripe
                  </p>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
