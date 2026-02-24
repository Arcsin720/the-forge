import React, { HTMLAttributes } from "react";

/**
 * Props pour le composant Card (conteneur réutilisable)
 * Hérite de tous les attributs HTML de <div>
 * @param variant - Apparence visuelle de la carte (default, highlight, dark)
 * @param padding - Espacement intérieur (sm, md, lg)
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "dark";
  padding?: "sm" | "md" | "lg";
}

/**
 * Styles pour chaque variante de Card:
 * - default: Bordure standard avec arrière-plan semi-transparent (usage général)
 * - highlight: Bordure et arrière-plan avec accent color (pour mettre en avant)
 * - dark: Arrière-plan plus foncé avec bordure subtile (pour contenu secondaire)
 */
const variantStyles: Record<string, string> = {
  default:
    "border border-forge-border bg-black/40 backdrop-blur-sm",
  highlight:
    "border border-forge-accent/60 bg-forge-accent/10 backdrop-blur-sm",
  dark: "border border-forge-border/50 bg-black/60 backdrop-blur"
};

/**
 * Styles de padding (espacement intérieur) pour chaque taille:
 * - sm: p-4 (petit padding, pour les cartes compactes)
 * - md: p-6 (padding standard et par défaut)
 * - lg: p-8 (grand padding, pour plus d'espace)
 */
const paddingStyles: Record<string, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

/**
 * Composant Card - Conteneur polyvalent réutilisable
 * 
 * Utilisé comme enveloppe pour grouper et mettre en forme le contenu.
 * Supporte plusieurs variantes visuelles et options de padding.
 * Inclut backdrop blur pour l'effet de verre dépoli.
 * 
 * @example
 * <Card variant="default" padding="md">
 *   <h2>Titre</h2>
 *   <p>Contenu de la carte</p>
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl
          transition-all duration-200
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className || ""}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
