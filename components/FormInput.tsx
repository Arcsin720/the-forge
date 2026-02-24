import React, { InputHTMLAttributes } from "react";

/**
 * Props pour le composant FormInput (champ de saisie de formulaire)
 * Hérite de tous les attributs HTML de <input>
 * @param label - Étiquette affichée au-dessus du champ
 * @param error - Message d'erreur (affiche le champ en rouge si présent)
 * @param hint - Texte d'aide affiché sous le champ
 * @param isValid - Indique si la validation a réussi (affiche le champ en vert)
 */
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
}

/**
 * Composant FormInput - Champ de saisie stylisé pour formulaires
 * 
 * Fonctionnalités:
 * - Label optionnel
 * - Retours visuels d'erreur (bordure rouge, arrière-plan rouge clair)
 * - Retours visuels de validation (bordure verte quand valide)
 * - Texte d'aide/hint optionnel sous le champ
 * - Couleurs adaptées au thème sombre
 * - Tous les attributs HTML natifs de <input> supportés
 * 
 * États visuels:
 * - Normal: bordure grise standard
 * - Erreur: bordure rouge avec arrière-plan rougeâtre
 * - Valide: bordure verte (activé via isValid)
 * 
 * @example
 * <FormInput
 *   label="Email"
 *   type="email"
 *   placeholder="votre@email.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 *   hint="Utilisé pour votre connexion"
 * />
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, isValid, className, ...props }, ref) => {
    // Détermine la couleur de bordure selon l'état du champ
    const hasError = !!error;
    const borderColor = hasError
      ? "border-red-600/50"
      : isValid
        ? "border-green-600/50"
        : "border-forge-border";

    // Arrière-plan rouge faible en cas d'erreur
    const bgColor = hasError ? "bg-red-950/10" : "bg-black/60";

    return (
      <div className="w-full space-y-2">
        {/* Étiquette optionnelle du champ */}
        {label && (
          <label className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}

        {/* Champ de saisie avec styles adaptatifs */}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg
            border ${borderColor}
            ${bgColor}
            text-sm text-slate-100
            placeholder-slate-500
            focus:outline-none focus:border-forge-accent/70 focus:ring-1 focus:ring-forge-accent/50
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className || ""}
          `}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        {hint && !error && (
          <p className="text-xs text-slate-400">{hint}</p>
        )}

        {isValid && !error && (
          <p className="text-xs text-green-400">✓ Valide</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
