import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { CloseIcon } from "../../../icons";
import { t } from "../../../i18n";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  footer,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center p-4 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#101828]/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 dark:border dark:border-gray-800`}
          >
            <div className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800 px-6 py-5 dark:border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-falah-accent/10 to-transparent" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  aria-label={t("common.close")}
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && (
              <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
