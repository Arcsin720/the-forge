"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

function hasForgedCookie() {
  return document.cookie.split("; ").some((c) => c.startsWith("forged=true"));
}

export function ForgeGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;
    if (!hasForgedCookie()) router.replace("/");
  }, [pathname, router]);

  return <>{children}</>;
}

