"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers /start (le funnel canonique)
    router.replace("/start?tier=pro");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-forge-background">
      <p className="text-slate-400">Redirection en cours...</p>
    </div>
  );
}
