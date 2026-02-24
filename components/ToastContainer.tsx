"use client";

import React from "react";
import { useToast, ToastType } from "./ToastProvider";

const toastStyles: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: "bg-green-950/80",
    border: "border-green-600/50",
    icon: "✓"
  },
  error: {
    bg: "bg-red-950/80",
    border: "border-red-600/50",
    icon: "✕"
  },
  info: {
    bg: "bg-blue-950/80",
    border: "border-blue-600/50",
    icon: "ⓘ"
  },
  warning: {
    bg: "bg-yellow-950/80",
    border: "border-yellow-600/50",
    icon: "⚠"
  }
};

const textColors: Record<ToastType, string> = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-blue-400",
  warning: "text-yellow-400"
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type];
        const textColor = textColors[toast.type];

        return (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-lg
              border ${style.border}
              ${style.bg} backdrop-blur-sm
              animate-in fade-in slide-in-from-right-4
              text-sm ${textColor}
            `}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{style.icon}</span>
            <p className="flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
