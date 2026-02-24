/**
 * Système de logging des événements
 * Enregistre les événements clés pour analytics et debugging
 */

export interface AnalyticsEvent {
  event: string;
  timestamp: string;
  userId?: string;
  email?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}

// En production, ceci pourrait être envoyé à PostHog, Mixpanel, etc.
// Pour l'instant, on log juste en console avec des prefixes structurés
const logBuffer: AnalyticsEvent[] = [];

export function logEvent(event: AnalyticsEvent) {
  logBuffer.push(event);

  // Log en console avec prefix [ANALYTICS]
  console.log("[ANALYTICS]", JSON.stringify(event));

  // Garder un buffer limité en mémoire (100 événements max)
  if (logBuffer.length > 100) {
    logBuffer.shift();
  }
}

/**
 * Log une inscription réussie
 */
export function logRegistration(email: string, ip: string) {
  logEvent({
    event: "user_registered",
    timestamp: new Date().toISOString(),
    email,
    ip,
    metadata: { source: "api_register" }
  });
}

/**
 * Log un checkout initié
 */
export function logCheckoutInitiated(email: string, ip: string, tier: string, goal: string) {
  logEvent({
    event: "checkout_initiated",
    timestamp: new Date().toISOString(),
    email,
    ip,
    metadata: { tier, goal }
  });
}

/**
 * Log un paiement réussi
 */
export function logPaymentSucceeded(email: string, tier: string, goal: string, stripeSessionId: string) {
  logEvent({
    event: "payment_succeeded",
    timestamp: new Date().toISOString(),
    email,
    metadata: { tier, goal, stripeSessionId }
  });
}

/**
 * Log un programme généré
 */
export function logProgramGenerated(email: string, tier: string, goal: string, duration: number) {
  logEvent({
    event: "program_generated",
    timestamp: new Date().toISOString(),
    email,
    metadata: { tier, goal, durationMs: duration }
  });
}

/**
 * Log une erreur API
 */
export function logApiError(endpoint: string, error: string, ip?: string) {
  logEvent({
    event: "api_error",
    timestamp: new Date().toISOString(),
    ip,
    metadata: { endpoint, error }
  });
}

/**
 * Récupérer l'historique des événements (pour debugging)
 */
export function getEventHistory(): AnalyticsEvent[] {
  return [...logBuffer];
}
