import "./globals.css";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import AuthSession from "@/components/AuthSession";
import { Suspense } from "react";

export const metadata = {
  title: "THE FORGE",
  description: "La forge de programmes sportifs premiums et personnalisés."
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body>
        <Suspense fallback={null}>
          <AuthSession>
            <AppShell>{props.children}</AppShell>
          </AuthSession>
        </Suspense>
      </body>
    </html>
  );
}
