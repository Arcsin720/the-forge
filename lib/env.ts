/**
 * Environment variables validation
 * Fails fast at startup if required vars are missing
 */

const requiredEnv = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_BASIC",
  "STRIPE_PRICE_PRO",
  "STRIPE_PRICE_ELITE",
  "NEXT_PUBLIC_APP_URL"
] as const;

const optionalEnv = [
  "RESEND_API_KEY" // Optional pour email
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const env of requiredEnv) {
    if (!process.env[env]) {
      missing.push(env);
    }
  }

  // Optional vars are checked but not required
  const optionals = optionalEnv.filter(env => !process.env[env]);
  if (optionals.length > 0) {
    console.warn(`[ENV] Optional vars missing: ${optionals.join(", ")}`);
  }

  if (missing.length > 0) {
    console.error("[ENV] Missing required environment variables:");
    missing.forEach((env) => console.error(`  - ${env}`));
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  console.log("[ENV] ✓ All required environment variables are present");
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  STRIPE_PRICE_BASIC: process.env.STRIPE_PRICE_BASIC!,
  STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO!,
  STRIPE_PRICE_ELITE: process.env.STRIPE_PRICE_ELITE!,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  RESEND_API_KEY: process.env.RESEND_API_KEY
} as const;

// Validate on module load
if (typeof window === "undefined") {
  // Server-side only
  validateEnv();
}
