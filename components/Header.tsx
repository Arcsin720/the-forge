"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./Button";
import { useState, useEffect } from "react";

function NavLink(props: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return (
    <Link
      href={props.href}
      className={`text-xs font-medium transition-all duration-200 ${
        isActive
          ? "text-forge-accent border-b-2 border-forge-accent pb-1"
          : "text-slate-400 border-b-2 border-transparent pb-1 hover:text-slate-200"
      }`}
    >
      {props.label}
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const { status } = useSession();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("forge-cart") || "[]");
      setCartCount(cart.length);
    };
    
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    // Also listen for custom cart events
    window.addEventListener("cart-updated", updateCartCount);
    
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

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
    <header className="sticky top-0 z-30 border-b border-forge-border/40 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-sm border border-forge-accent/70 bg-gradient-to-br from-forge-accent/90 to-forge-accentSoft/60 shadow-lg group-hover:shadow-forgeGlow transition-shadow" />
          <div className="text-sm font-bold tracking-widest uppercase hidden sm:block">
            The Forge
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <NavLink href="/" label="Accueil" />
          <NavLink href="/pricing" label="Offres" />
          <NavLink href="/about" label="À propos" />
          {status === "authenticated" && (
            <NavLink href="/dashboard" label="Espace" />
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Cart Button */}
          <button
            onClick={() => router.push("/cart")}
            className="relative p-2 text-slate-400 hover:text-forge-accent transition-colors"
            title="Panier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0l2-9m-12 9h14m-14 0a1 1 0 11-2 0 1 1 0 012 0m14 0a1 1 0 11-2 0 1 1 0 012 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-forge-accent rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {status !== "authenticated" && (
            <>
              <Link
                href="/auth/signin"
                className="hidden sm:block text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-3 py-2"
              >
                Connexion
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/auth/signup")}
              >
                Inscription
              </Button>
            </>
          )}

          {status === "authenticated" && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrimary}
          >
            <span className="hidden sm:inline">Offre PRO</span>
            <span className="sm:hidden">PRO</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

