import { AnimatePresence, motion } from "framer-motion";
import { AlertHexaIcon } from "../../icons";
import { t } from "../../i18n";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = t("common.confirm"),
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#101828]/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 dark:border dark:border-gray-800"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertHexaIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition ${
                  variant === "danger"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-brand-500 hover:bg-brand-600"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
