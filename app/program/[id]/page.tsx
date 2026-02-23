import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProgramForUser } from "@/lib/programs";
import Link from "next/link";

type ProgramPageParams = {
  params: {
    id: string;
  };
};

export default async function ProgramPage(props: ProgramPageParams) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect(`/auth/signin?callbackUrl=/program/${props.params.id}`);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  });

  if (!user) {
    notFound();
  }

  const program = await getProgramForUser(props.params.id, user.id);

  if (!program) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-forge-background px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Programme
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-wide">
            THE FORGE {program.tier}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Objectif {program.goal} • Niveau {program.level} •{" "}
            {program.frequency} séances / semaine
          </p>
        </div>

        <section className="border border-forge-border bg-forge-surface/70 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap">
          {program.contentText}
        </section>

        {program.nutritionText && (
          <section className="border border-forge-border bg-black/40 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap">
            {program.nutritionText}
          </section>
        )}

        {program.youtubeLinks.length > 0 && (
          <section className="border border-forge-border bg-black/30 rounded-xl p-5 text-sm">
            <h2 className="text-sm font-semibold mb-2">Guides vidéos</h2>
            <ul className="space-y-1">
              {program.youtubeLinks.map((url: string) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-forge-accentSoft break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex items-center justify-between pt-2 text-xs">
          {program.tier === "ELITE" && (
            <Link
              href="/coaching"
              className="text-forge-accentSoft underline-offset-4 hover:underline"
            >
              Aller au coaching ELITE
            </Link>
          )}

          <Link
            href="/account"
            className="text-forge-accentSoft underline-offset-4 hover:underline"
          >
            Retour à mes programmes
          </Link>
        </div>
      </div>
    </main>
  );
}
