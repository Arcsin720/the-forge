import "./globals.css";
import "./animations.css";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import AuthSession from "@/components/AuthSession";
import { ToastProvider } from "@/components/ToastProvider";
import { ToastContainer } from "@/components/ToastContainer";

export const metadata = {
  title: "THE FORGE",
  description: "La forge de programmes sportifs premiums et personnalisés."
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body>
        <AuthSession>
          <ToastProvider>
            <AppShell>{props.children}</AppShell>
            <ToastContainer />
          </ToastProvider>
        </AuthSession>
      </body>
    </html>
  );
}
