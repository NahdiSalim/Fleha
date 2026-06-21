import { useEffect, useState } from "react";
import { t } from "../../i18n";
import Modal from "../ui/modal/Modal";

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  mode: "add" | "edit";
}

export default function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  mode,
}: ClientFormModalProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError("");
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t("clients.nameRequired"));
      return;
    }
    onSubmit(trimmed);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? t("clients.addNewClient") : t("clients.editClient")}
      subtitle={
        mode === "add"
          ? t("clients.addSubtitle")
          : t("clients.editSubtitle")
      }
      size="sm"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-white"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="client-form"
            className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {mode === "add" ? t("clients.addClient") : t("common.saveChanges")}
          </button>
        </div>
      }
    >
      <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="client-name"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("common.fullName")}
          </label>
          <input
            id="client-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder={t("clients.namePlaceholder")}
            autoFocus
            className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 dark:text-white outline-none dark:bg-gray-800 dark:border-gray-700 transition focus:ring-4 focus:ring-brand-500/15 ${
              error
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-brand-500"
            }`}
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </form>
    </Modal>
  );
}
