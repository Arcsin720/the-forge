"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        name
      })
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Erreur lors de la création du compte");
      return;
    }

    router.push("/auth/signin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-forge-background">
      <div className="w-full max-w-md border border-forge-border bg-forge-surface/80 p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-semibold tracking-[0.2em] uppercase text-center mb-6">
          Création de compte
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full bg-black/40 border border-forge-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-forge-accent"
            />
          </div>

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
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400 text-center">
          Déjà une forge ?{" "}
          <Link href="/auth/signin" className="text-forge-accentSoft">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}

