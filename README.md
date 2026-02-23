# THE FORGE

Application Next.js pour générer et vendre des programmes sportifs premium et personnalisés.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- NextAuth (Credentials)
- Prisma (PostgreSQL)
- Stripe Checkout + webhooks

## Prérequis

- Node.js
- PostgreSQL
- Compte Stripe (mode test suffisant)

## Installation

```bash
npm install
```

## Configuration de l'environnement

Copie le fichier `.env.example` vers `.env.local` puis remplis les valeurs :

- `DATABASE_URL` : URL de connexion PostgreSQL
- `NEXTAUTH_SECRET` : chaîne aléatoire sécurisée
- `NEXTAUTH_URL` : URL publique de l'app (en local: `http://localhost:3000`)
- `STRIPE_SECRET_KEY` : clé secrète Stripe
- `STRIPE_WEBHOOK_SECRET` : secret du webhook Stripe
- `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ELITE` : IDs de prix Stripe
- `NEXT_PUBLIC_APP_URL` : URL publique (utilisée pour les redirections Stripe)

## Prisma

Applique les migrations et génère le client :

```bash
npx prisma migrate dev
npx prisma generate
```

## Développement

```bash
npm run dev
```

L'application tourne sur `http://localhost:3000`.

## Scripts utiles

- `npm run lint` : lint Next.js/ESLint
- `npm run build` : build de production

## Funnel produit

THE FORGE est structuré comme un mini-SaaS avec un funnel simple :

- **Landing publique** : `/`
  - Hero dark, explication courte, 3 étapes (Choisir / Payer / Recevoir)
  - CTA principal : bouton "Choisir l'offre PRO" → `/start?tier=pro`
  - CTA secondaire : lien "Voir les offres" → `/pricing`

- **Page offres** : `/pricing`
  - 3 cartes pricing (BASIC / PRO / ELITE) dans une grille responsive
  - Comparaison des fonctionnalités par tier
  - Boutons "Choisir l'offre" → `/start?tier=basic|pro|elite`

- **À propos** : `/about`
  - Page simple qui explique le projet et la stack

- **Quiz de départ** : `/start`
  - Protégé : nécessite un utilisateur connecté
  - Lit `tier` depuis `searchParams` (`/start?tier=basic|pro|elite`)
  - Si `tier` absent ou invalide → redirect `/pricing`
  - Si non connecté → redirect `/auth/signin?callbackUrl=/start?tier=...`
  - Étape 1/2 : questions sur objectif / niveau / fréquence
  - Bouton "Passer au paiement" qui appelle l’API `/api/checkout`
    avec `{ tier, goal, level, frequency }`

- **Paiement & livraison**
  - L’API `/api/checkout` crée une session Stripe Checkout
  - Le webhook Stripe existant génère le programme après paiement
  - L’utilisateur retrouve ses programmes dans `/account` et `/program/[id]`
