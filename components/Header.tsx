"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function NavLink(props: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return (
    <Link
      href={props.href}
      className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
        isActive
          ? "bg-forge-accent/10 text-forge-accent border border-forge-accent/70"
          : "text-slate-300 border border-transparent hover:border-forge-accent/40 hover:text-forge-accent"
      }`}
    >
      {props.label}
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const { status } = useSession();

  function handlePrimary() {
    if (status === "authenticated") {
      router.push("/start?tier=pro");
    } else {
      router.push(
        "/auth/signin?callbackUrl=" + encodeURIComponent("/start?tier=pro")
      );
    }
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-forge-border/60 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-sm border border-forge-accent/60 bg-gradient-to-br from-forge-accent/90 to-forge-accentSoft/60 shadow-forgeGlow" />
          <div className="text-xs font-semibold tracking-[0.24em] uppercase">
            THE FORGE
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <NavLink href="/" label="Accueil" />
          <NavLink href="/pricing" label="Offres" />
          <NavLink href="/about" label="À propos" />
          {status === "authenticated" && (
            <NavLink href="/account" label="Mon espace" />
          )}
        </nav>

        <div className="flex items-center gap-3">
          {status !== "authenticated" && (
            <>
              <Link
                href="/auth/signin"
                className="rounded-full border border-transparent px-3 py-1.5 text-xs text-slate-300 hover:border-forge-accent/50 hover:text-forge-accent transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full border border-forge-accent/70 bg-forge-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-black"
              >
                Inscription
              </Link>
            </>
          )}

          {status === "authenticated" && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-forge-accent/50 px-3 py-1.5 text-xs text-slate-300 hover:text-red-400 hover:border-red-400/50 transition-colors"
            >
              Déconnexion
            </button>
          )}

          <button
            type="button"
            onClick={handlePrimary}
            className="hidden rounded-full border border-forge-accent/70 bg-forge-accent/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-forge-accent hover:bg-forge-accent/20 md:inline-flex"
          >
            Choisir l&apos;offre PRO
          </button>
        </div>
      </div>
    </header>
  );
}

