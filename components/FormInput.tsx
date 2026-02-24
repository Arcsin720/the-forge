import React, { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  isValid?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, isValid, className, ...props }, ref) => {
    const hasError = !!error;
    const borderColor = hasError
      ? "border-red-600/50"
      : isValid
        ? "border-green-600/50"
        : "border-forge-border";

    const bgColor = hasError ? "bg-red-950/10" : "bg-black/60";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}

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
