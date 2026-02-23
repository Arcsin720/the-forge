"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export default function AuthSession(props: { children: ReactNode }) {
  return <SessionProvider>{props.children}</SessionProvider>;
}

