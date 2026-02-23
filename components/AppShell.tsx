"use client";

import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppShell(props: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-forge-background to-black text-slate-100">
      <Header />
      <main className="min-h-[calc(100vh-120px)]">{props.children}</main>
      <Footer />
    </div>
  );
}

