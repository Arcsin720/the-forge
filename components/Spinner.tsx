import React from 'react';

/**
 * Props pour le composant Spinner (indicateur de chargement)
 * @param size - Taille du spinner: 'sm' (petit), 'md' (moyen), 'lg' (grand)
 * @param className - Classes CSS additionnelles pour personnaliser le style
 */
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Définit les dimensions du spinner selon sa taille
 * - sm: 4x4 (petit, pour les boutons)
 * - md: 6x6 (moyen, utilisation standard)
 * - lg: 8x8 (grand, pour les sections principales)
 */
const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

/**
 * Composant Spinner - Indicateur visuel de chargement avec animation rotatoire
 * 
 * Utilise deux cercles concentriques:
 * - Un cercle de bordure statique en gris clair (arrière-plan)
 * - Un cercle avec bordure top et right en accent color (animation de rotation)
 * 
 * @example
 * <Spinner size="md" />
 * <Button isLoading><Spinner size="sm" /> Chargement...</Button>
 */
export const Spinner = React.forwardRef<
  HTMLDivElement,
  SpinnerProps
>(({ size = 'md', className = '' }, ref) => {
  return (
    <div ref={ref} className={`${className}`}>
      {/* Conteneur du spinner avec dimensions basées sur la taille */}
      <div className={`${sizeStyles[size]} relative`}>
        {/* Cercle de bordure statique (arrière-plan gris) */}
        <div className="absolute inset-0 border-2 border-slate-700/30 rounded-full" />
        
        {/* Cercle rotatif avec couleur accent (top et right) pour l'animation */}
        <div className="absolute inset-0 border-2 border-transparent border-t-forge-accent border-r-forge-accent rounded-full animate-spin" />
      </div>
    </div>
  );
});

Spinner.displayName = 'Spinner';
