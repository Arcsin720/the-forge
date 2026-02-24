import React from 'react';
import { Card } from './Card';

/**
 * Props pour le composant Modal (fenêtre modale)
 * @param isOpen - Contrôle l'affichage de la modale
 * @param onClose - Callback appelé quand la modale doit se fermer
 * @param title - Titre affiché dans l'en-tête de la modale
 * @param children - Contenu principal de la modale
 * @param footer - Contenu optionnel du pied de page (boutons d'actions)
 * @param size - Largeur maximale (sm, md, lg)
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Composant Modal - Fenêtre de dialogue centrée avec backdrop
 * 
 * Architecture:
 * - Backdrop opaque avec blur qui ferme la modale au clic
 * - Fenêtre centrée avec Card component
 * - En-tête avec titre et bouton fermer (X)
 * - Contenu principal scrollable si trop long
 * - Pied de page optionnel séparé par une ligne
 * 
 * Caractéristiques:
 * - Ne rend rien si isOpen est false
 * - Fermeture possible via backdrop, bouton X, ou callback externe
 * - Z-index élevé (z-50) pour rester au-dessus du contenu
 * - Responsive avec 3 tailles (sm/md/lg)
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmation"
 *   footer={<Button onClick={handleDelete}>Confirmer</Button>}
 * >
 *   Êtes-vous sûr?
 * </Modal>
 */
export const Modal = React.forwardRef<
  HTMLDivElement,
  ModalProps
>(({ isOpen, onClose, title, children, footer, size = 'md' }, ref) => {
  // N'affiche rien si la modale n'est pas ouverte
  if (!isOpen) return null;

  // Classes de taille maximale pour la modale
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <>
      {/* Backdrop semi-transparent avec blur - cliquable pour fermer */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <Card
          ref={ref}
          variant="dark"
          padding="lg"
          className={`relative w-full ${sizeClasses[size]} transform transition-all`}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Fermer la modale"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-forge-border/30 pt-4">
              {footer}
            </div>
          )}
        </Card>
      </div>
    </>
  );
});

Modal.displayName = 'Modal';
