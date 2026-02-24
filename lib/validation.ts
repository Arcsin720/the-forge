import { z } from "zod";

// Validation schemas for all API inputs

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir un chiffre"),
  name: z.string().optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const checkoutSchema = z.object({
  goal: z
    .string()
    .min(2, "Objectif invalide")
    .max(100, "Objectif trop long"),
  level: z
    .string()
    .min(2, "Niveau invalide")
    .max(100, "Niveau trop long"),
  frequency: z
    .string()
    .regex(/^\d+$/, "Fréquence invalide")
    .refine(
      (f) => parseInt(f) >= 1 && parseInt(f) <= 7,
      "La fréquence doit être entre 1 et 7 séances par semaine"
    ),
  tier: z.enum(["BASIC", "PRO", "ELITE"])
    .refine(
      (val) => ["BASIC", "PRO", "ELITE"].includes(val),
      "Tier invalide"
    )
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Utility to validate and return parsed data or error
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: true; data: T } | { valid: false; error: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return { valid: false, error: errors };
  }

  return { valid: true, data: result.data };
}
