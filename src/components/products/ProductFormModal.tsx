import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import type { Pack } from "../../types/inventory";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, packId: string, pricePerKg: number) => void;
  packs: Pack[];
  initialName?: string;
  initialPackId?: string;
  initialPrice?: number;
  mode: "add" | "edit";
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  packs,
  initialName = "",
  initialPackId = "",
  initialPrice = 0,
  mode,
}: ProductFormModalProps) {
  const [name, setName] = useState(initialName);
  const [packId, setPackId] = useState(initialPackId);
  const [price, setPrice] = useState(String(initialPrice || ""));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setPackId(initialPackId || packs[0]?.id || "");
      setPrice(initialPrice ? String(initialPrice) : "");
      setErrors({});
    }
  }, [isOpen, initialName, initialPackId, initialPrice, packs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const trimmed = name.trim();
    const parsedPrice = parseFloat(price);

    if (!trimmed) nextErrors.name = t("products.nameRequired");
    if (!packId) nextErrors.packId = t("products.packRequired");
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = t("products.priceInvalid");
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(trimmed, packId, parsedPrice);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? t("products.addNewProduct") : t("products.editProduct")}
      subtitle={mode === "add" ? t("products.addSubtitle") : t("products.editSubtitle")}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-white">
            {t("common.cancel")}
          </button>
          <button type="submit" form="product-form" className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            {mode === "add" ? t("products.addProduct") : t("common.saveChanges")}
          </button>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t("common.name")}</label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder={t("products.namePlaceholder")}
            autoFocus
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-brand-500/15 ${errors.name ? "border-red-300" : "border-gray-200 focus:border-brand-500"}`}
          />
          {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="product-pack" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t("common.pack")}</label>
          <select
            id="product-pack"
            value={packId}
            onChange={(e) => { setPackId(e.target.value); setErrors((p) => ({ ...p, packId: "" })); }}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-brand-500/15 ${errors.packId ? "border-red-300" : "border-gray-200 focus:border-brand-500"}`}
          >
            {packs.length === 0 ? (
              <option value="">{t("products.noPacksAvailable")}</option>
            ) : (
              packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} ({pack.weight} {t("common.kg")})
                </option>
              ))
            )}
          </select>
          {errors.packId && <p className="mt-2 text-sm text-red-500">{errors.packId}</p>}
        </div>
        <div>
          <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t("products.pricePerKgLabel")}</label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: "" })); }}
            placeholder="e.g. 18.50"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-brand-500/15 ${errors.price ? "border-red-300" : "border-gray-200 focus:border-brand-500"}`}
          />
          {errors.price && <p className="mt-2 text-sm text-red-500">{errors.price}</p>}
        </div>
      </form>
    </Modal>
  );
}
