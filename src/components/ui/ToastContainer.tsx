"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgStyle = "bg-white dark:bg-slate-900 border-emerald-500 text-slate-800 dark:text-slate-100";
        let iconColor = "text-emerald-500";

        if (toast.type === "error") {
          Icon = AlertCircle;
          bgStyle = "bg-white dark:bg-slate-900 border-red-500 text-slate-800 dark:text-slate-100";
          iconColor = "text-red-500";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          bgStyle = "bg-white dark:bg-slate-900 border-amber-500 text-slate-800 dark:text-slate-100";
          iconColor = "text-amber-500";
        } else if (toast.type === "info") {
          Icon = Info;
          bgStyle = "bg-white dark:bg-slate-900 border-indigo-500 text-slate-800 dark:text-slate-100";
          iconColor = "text-indigo-500";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border-l-4 rounded-lg shadow-xl p-3.5 flex items-start gap-3 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-2 duration-200 ${bgStyle}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
