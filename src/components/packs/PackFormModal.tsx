import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";

interface PackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, weight: number) => void;
  initialName?: string;
  initialWeight?: number;
  mode: "add" | "edit";
}

export default function PackFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialWeight = 0,
  mode,
}: PackFormModalProps) {
  const [name, setName] = useState(initialName);
  const [weight, setWeight] = useState(String(initialWeight || ""));
  const [errors, setErrors] = useState<{ name?: string; weight?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setWeight(initialWeight ? String(initialWeight) : "");
      setErrors({});
    }
  }, [isOpen, initialName, initialWeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; weight?: string } = {};
    const trimmed = name.trim();
    const parsedWeight = parseFloat(weight);

    if (!trimmed) nextErrors.name = t("packs.nameRequired");
    if (Number.isNaN(parsedWeight) || parsedWeight <= 0) {
      nextErrors.weight = t("packs.weightInvalid");
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(trimmed, parsedWeight);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? t("packs.addNewPack") : t("packs.editPack")}
      subtitle={mode === "add" ? t("packs.addSubtitle") : t("packs.editSubtitle")}
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
            form="pack-form"
            className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {mode === "add" ? t("packs.addPack") : t("common.saveChanges")}
          </button>
        </div>
      }
    >
      <form id="pack-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pack-name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("packs.packName")}
          </label>
          <input
            id="pack-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder={t("packs.namePlaceholder")}
            autoFocus
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-brand-500/15 ${
              errors.name ? "border-red-300" : "border-gray-200 focus:border-brand-500"
            }`}
          />
          {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="pack-weight" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("packs.packWeight")}
          </label>
          <input
            id="pack-weight"
            type="number"
            step="0.01"
            min="0"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setErrors((prev) => ({ ...prev, weight: undefined }));
            }}
            placeholder={t("packs.weightPlaceholder")}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-brand-500/15 ${
              errors.weight ? "border-red-300" : "border-gray-200 focus:border-brand-500"
            }`}
          />
          {errors.weight && <p className="mt-2 text-sm text-red-500">{errors.weight}</p>}
        </div>
      </form>
    </Modal>
  );
}
