/**
 * Gestion du panier (localStorage)
 * Stocke les choix du quiz avant checkout
 */

export interface CartItem {
  goal: string;
  level: string;
  frequency: string;
  tier: "BASIC" | "PRO" | "ELITE";
}

const CART_KEY = "forge_cart";

/**
 * Récupérer le panier depuis localStorage
 */
export function getCart(): CartItem | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Sauvegarder le panier dans localStorage
 */
export function setCart(item: CartItem): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(item));
    // Émettre un événement custom pour notifier le header
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("[CART] Failed to save:", error);
  }
}

/**
 * Effacer le panier
 */
export function clearCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_KEY);
    // Émettre un événement custom pour notifier le header
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("[CART] Failed to clear:", error);
  }
}

/**
 * Vérifier si le panier existe
 */
export function hasCart(): boolean {
  return getCart() !== null;
}

/**
 * Prix du tier
 */
export function getTierPrice(tier: "BASIC" | "PRO" | "ELITE"): number {
  const prices: Record<string, number> = {
    BASIC: 49,
    PRO: 99,
    ELITE: 199
  };
  return prices[tier] || 0;
}

/**
 * Description du tier
 */
export function getTierDescription(tier: "BASIC" | "PRO" | "ELITE"): string {
  const descriptions: Record<string, string> = {
    BASIC: "Programme essentiel",
    PRO: "Programme complet avec coaching",
    ELITE: "Programme premium avec suivi illimité"
  };
  return descriptions[tier] || "";
}
