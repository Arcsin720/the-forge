import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "dark";
  padding?: "sm" | "md" | "lg";
}

const variantStyles: Record<string, string> = {
  default:
    "border border-forge-border bg-black/40 backdrop-blur-sm",
  highlight:
    "border border-forge-accent/60 bg-forge-accent/10 backdrop-blur-sm",
  dark: "border border-forge-border/50 bg-black/60 backdrop-blur"
};

const paddingStyles: Record<string, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

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
