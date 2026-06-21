import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => void;
  initialName?: string;
  initialPhone?: string;
  mode: "add" | "edit";
}

export default function SupplierFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialPhone = "",
  mode,
}: SupplierFormModalProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setPhone(initialPhone);
      setErrors({});
    }
  }, [isOpen, initialName, initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) nextErrors.name = t("suppliers.nameRequired");
    if (!trimmedPhone) nextErrors.phone = t("suppliers.phoneRequired");

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(trimmedName, trimmedPhone);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? t("suppliers.addNewSupplier") : t("suppliers.editSupplier")}
      subtitle={mode === "add" ? t("suppliers.addSubtitle") : t("suppliers.editSubtitle")}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-white">
            {t("common.cancel")}
          </button>
          <button type="submit" form="supplier-form" className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            {mode === "add" ? t("suppliers.addSupplier") : t("common.saveChanges")}
          </button>
        </div>
      }
    >
      <form id="supplier-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="supplier-name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t("common.fullName")}</label>
          <input id="supplier-name" type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }} placeholder={t("suppliers.namePlaceholder")} autoFocus className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-brand-500/15 ${errors.name ? "border-red-300" : "border-gray-200 focus:border-brand-500"}`} />
          {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="supplier-phone" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t("common.phoneNumber")}</label>
          <input id="supplier-phone" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }} placeholder={t("suppliers.phonePlaceholder")} className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-brand-500/15 ${errors.phone ? "border-red-300" : "border-gray-200 focus:border-brand-500"}`} />
          {errors.phone && <p className="mt-2 text-sm text-red-500">{errors.phone}</p>}
        </div>
      </form>
    </Modal>
  );
}
