import React, { ButtonHTMLAttributes } from "react";

/**
 * Variant de bouton disponibles:
 * - primary: Bouton principal avec accent color (pour les actions principales)
 * - secondary: Bouton secondaire avec accent faible (pour les actions alternatives)
 * - danger: Bouton de danger avec couleur rouge (pour les suppressions/actions irréversibles)
 * - outline: Bouton épuré avec bordure uniquement (pour les actions tertiaires)
 */
type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

/**
 * Tailles de bouton:
 * - sm: Petit (px-3 py-1.5, text-xs) - Pour les champs de forme ou actions mineures
 * - md: Moyen (px-4 py-2, text-sm) - Taille par défaut et standard
 * - lg: Grand (px-6 py-3, text-base) - Pour les CTA (call-to-action) importants
 */
type ButtonSize = "sm" | "md" | "lg";

/**
 * Props pour le composant Button
 * Hérite de tous les attributs HTML de <button>
 * @param variant - Style visuel du bouton (primary, secondary, danger, outline)
 * @param size - Taille du bouton (sm, md, lg)
 * @param isLoading - Affiche un spinner et désactive le bouton pendant le chargement
 * @param fullWidth - Rend le bouton 100% large (block)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Styles pour chaque variante de bouton
 * Chaque variante inclut: couleur de base, survol, et état désactivé
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-forge-accent text-black hover:bg-forge-accentSoft disabled:bg-forge-accent/50",
  secondary:
    "bg-forge-accent/10 text-forge-accent border border-forge-accent/50 hover:bg-forge-accent/20 disabled:opacity-50",
  danger:
    "bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30 disabled:opacity-50",
  outline:
    "border border-forge-border text-slate-300 hover:border-forge-accent/50 hover:text-forge-accent disabled:opacity-50"
};

/**
 * Styles pour chaque taille de bouton
 * Padding et taille de texte varient selon la taille
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
};

/**
 * Composant Button - Bouton réutilisable avec multiples variantes et états
 * 
 * Supporte:
 * - 4 variantes de style (primary, secondary, danger, outline)
 * - 3 tailles (sm, md, lg)
 * - État de chargement avec spinner animé
 * - Mode pleine largeur
 * - Tous les attributs HTML natifs de <button>
 * 
 * @example
 * <Button variant="primary" size="md">Cliquez-moi</Button>
 * <Button variant="danger" onClick={() => deleteItem()}>Supprimer</Button>
 * <Button isLoading>Chargement en cours...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          rounded-lg font-semibold tracking-wider uppercase
          transition-colors duration-200
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className || ""}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
