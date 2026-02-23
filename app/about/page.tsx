export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 space-y-6 text-sm text-slate-300">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-forge-accentSoft/80">
          À propos
        </p>
        <h1 className="text-3xl font-semibold">Ce qu&apos;est THE FORGE.</h1>
        <p className="text-slate-400">
          THE FORGE est un mini SaaS expérimental pensé comme une forge à
          programmes d&apos;entraînement. L&apos;objectif: sortir du bruit,
          éviter les programmes génériques, et générer un plan structuré autour
          de ton contexte réel.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-100">
          Comment ça fonctionne
        </h2>
        <p>
          Tu choisis ton offre, tu passes un court quiz, tu paies une seule
          fois via Stripe, et tu reçois un programme construit autour de ton
          objectif, de ton niveau et du nombre de séances que tu peux vraiment
          tenir chaque semaine.
        </p>
        <p>
          Techniquement, THE FORGE sert aussi de terrain de jeu: Next.js, App
          Router, Prisma, Stripe, authentification avec NextAuth, le tout dans
          un flow cohérent de mini SaaS.
        </p>
      </section>

      <section className="space-y-3 text-slate-400">
        <h2 className="text-base font-semibold text-slate-100">
          Pourquoi ce projet
        </h2>
        <p>
          Le but n&apos;est pas de remplacer un vrai coach humain, mais de
          proposer un produit clair: un seul paiement, un livrable concret, une
          expérience fluide, sans dark patterns.
        </p>
        <p>
          C&apos;est aussi un exemple concret de comment structurer un funnel
          simple: landing publique, page pricing, quiz, paiement, espace
          membre.
        </p>
      </section>
    </main>
  );
}

