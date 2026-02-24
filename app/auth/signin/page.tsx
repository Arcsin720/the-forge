"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    (searchParams?.get("callbackUrl") as string | null) ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Identifiants invalides");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-forge-background">
      <div className="w-full max-w-md border border-forge-border bg-forge-surface/80 p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-semibold tracking-[0.2em] uppercase text-center mb-6">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-black/40 border border-forge-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forge-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-black/40 border border-forge-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forge-accent"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded-md bg-forge-accent text-black text-sm font-semibold tracking-wide uppercase disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400 text-center">
          Pas encore de compte ?{" "}
          <Link href="/auth/signup" className="text-forge-accentSoft">
            Créer une forge
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-forge-background" />}>
      <SignInContent />
    </Suspense>
  );
}
