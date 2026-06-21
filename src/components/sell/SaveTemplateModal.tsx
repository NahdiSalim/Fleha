import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SaveTemplateModal({
  isOpen,
  onClose,
  onSave,
}: SaveTemplateModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("saveTemplate.nameRequired"));
      return;
    }
    onSave(name.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("saveTemplate.title")}
      subtitle={t("saveTemplate.subtitle")}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-white">
            {t("common.cancel")}
          </button>
          <button type="submit" form="save-template-form" className="flex-1 rounded-xl bg-falah-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-falah-accent-dark">
            {t("saveTemplate.save")}
          </button>
        </div>
      }
    >
      <form id="save-template-form" onSubmit={handleSubmit}>
        <label htmlFor="template-name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("saveTemplate.nameLabel")}
        </label>
        <input
          id="template-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          placeholder={t("saveTemplate.namePlaceholder")}
          autoFocus
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-brand-500/15 ${error ? "border-red-300" : "border-gray-200 focus:border-brand-500"}`}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>
    </Modal>
  );
}
