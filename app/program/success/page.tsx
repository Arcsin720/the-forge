import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type SuccessPageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default async function ProgramSuccessPage(props: SuccessPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    const callbackUrl = `/program/success${
      props.searchParams.session_id
        ? `?session_id=${encodeURIComponent(props.searchParams.session_id)}`
        : ""
    }`;

    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const sessionId = props.searchParams.session_id;

  if (!sessionId) {
    redirect("/account");
  }

  const program = await prisma.program.findFirst({
    where: {
      stripeCheckoutId: sessionId,
      user: {
        email: session.user.email
      }
    }
  });

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 space-y-8">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
          Succès
        </p>
        <h1 className="text-2xl font-semibold tracking-wide">
          Ton programme vient d&apos;être forgé.
        </h1>
        <p className="max-w-xl text-sm text-slate-400">
          Le paiement Stripe est confirmé et THE FORGE a généré ton programme
          personnalisé. Tu peux l&apos;ouvrir dès maintenant ou le retrouver
          plus tard dans ton espace membre.
        </p>
      </section>

      {program ? (
        <section className="space-y-4 rounded-xl border border-forge-border bg-forge-surface/70 px-5 py-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Programme généré
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-100">
              THE FORGE {program.tier}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Objectif {program.goal} • Niveau {program.level} •{" "}
              {program.frequency} séances / semaine
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/program/${program.id}`}
              className="inline-flex items-center rounded-full border border-forge-accent/70 bg-forge-accent px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black shadow-forgeGlow hover:brightness-105"
            >
              Voir mon programme
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center rounded-full border border-forge-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-forge-accent/60 hover:text-forge-accent"
            >
              Aller à mon espace
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-forge-border bg-black/40 px-5 py-5 text-sm text-slate-300">
          <p className="font-medium">
            Ton paiement est passé, la forge termine la génération.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Si ton programme n&apos;apparaît pas encore, attends quelques
            secondes puis rafraîchis ton espace membre.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/account"
              className="inline-flex items-center rounded-full border border-forge-accent/70 bg-forge-accent px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black shadow-forgeGlow hover:brightness-105"
            >
              Aller à mon espace
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

