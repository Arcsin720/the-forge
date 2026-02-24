import React from 'react';

/**
 * Props pour le composant Badge (petit label/étiquette)
 * @param label - Texte à afficher dans le badge
 * @param variant - Couleur et style du badge (primary, success, warning, danger, info, accent)
 * @param size - Taille compacte (sm, md)
 * @param className - Classes CSS additionnelles
 */
interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Composant Badge - Petite étiquette colorée pour catégories/statuts
 * 
 * Cas d'usage:
 * - Tags de statut (En cours, Complété, Erreur)
 * - Badges de priorité (Important, Normal, Faible)
 * - Labels de catégorie (Nouveau, Premium, Exclusif)
 * 
 * Variantes:
 * - primary: Gris standard (usage général)
 * - success: Vert (pour succès/valid)
 * - warning: Jaune (pour avertissements)
 * - danger: Rouge (pour erreurs/danger)
 * - info: Bleu (pour informations)
 * - accent: Orange (couleur signature THE FORGE)
 * 
 * @example
 * <Badge label="Nouveau" variant="success" />
 * <Badge label="Important" variant="danger" size="md" />
 */
export const Badge = React.forwardRef<
  HTMLSpanElement,
  BadgeProps
>(({ label, variant = 'primary', size = 'sm', className = '' }, ref) => {
  // Styles de base communs à tous les badges
  const baseStyles = 'inline-flex items-center font-semibold uppercase tracking-wider rounded-full';

  // Styles spécifiques à chaque variante (couleurs, bordures, arrière-plan)
  const variantStyles = {
    primary: 'bg-slate-700/30 text-slate-300 border border-slate-600',
    success: 'bg-green-500/10 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    accent: 'bg-forge-accent/10 text-forge-accent border border-forge-accent/30'
  };

  // Styles de taille (padding et taille de texte)
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs'
  };

  return (
    <span
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {label}
    </span>
  );
});

Badge.displayName = 'Badge';
