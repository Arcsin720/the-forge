/**
 * Rate limiting pour API endpoints
 * Limite les requêtes par IP et endpoint
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Obtenir l'IP de la requête
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Vérifier et mettre à jour le rate limit
 * @param ip - Adresse IP du client
 * @param endpoint - Nom de l'endpoint (ex: "register", "checkout")
 * @param limit - Nombre max de requêtes
 * @param windowMs - Fenêtre de temps en millisecondes
 * @returns true si autorisé, false si limité
 */
export function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number = 5,
  windowMs: number = 60 * 1000 // 1 minute par défaut
): boolean {
  const key = `${endpoint}:${ip}`;
  const now = Date.now();

  if (!store[key]) {
    store[key] = { count: 1, resetTime: now + windowMs };
    return true;
  }

  const entry = store[key];

  // Si la fenêtre est expirée, réinitialiser
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + windowMs;
    return true;
  }

  // Incrémenter et vérifier la limite
  entry.count++;
  return entry.count <= limit;
}

/**
 * Retourner une réponse JSON pour "Too Many Requests"
 */
export function tooManyRequests() {
  return new Response(
    JSON.stringify({ error: "Trop de requêtes, réessayez dans quelques minutes" }),
    {
      status: 429,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Nettoyer les entrées expirées toutes les 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 10 * 60 * 1000);
