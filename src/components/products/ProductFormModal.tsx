import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import type { ProductCategory } from "../../types/inventory";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, pricePerKg: number, category: ProductCategory) => void;
  initialName?: string;
  initialPrice?: number;
  initialCategory?: ProductCategory;
  mode: "add" | "edit";
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = "",
  initialPrice = 0,
  initialCategory = "vegetable",
  mode,
}: ProductFormModalProps) {
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(String(initialPrice || ""));
  const [category, setCategory] = useState<ProductCategory>(initialCategory);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setPrice(initialPrice ? String(initialPrice) : "");
      setCategory(initialCategory);
      setErrors({});
    }
  }, [isOpen, initialName, initialPrice, initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const trimmed = name.trim();
    const parsedPrice = parseFloat(price);

    if (!trimmed) nextErrors.name = t("products.nameRequired");
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      nextErrors.price = t("products.priceInvalid");
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(trimmed, parsedPrice, category);
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
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("products.category")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCategory("vegetable")}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                category === "vegetable"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t("products.vegetables")}
            </button>
            <button
              type="button"
              onClick={() => setCategory("fruit")}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                category === "fruit"
                  ? "border-falah-accent bg-falah-accent/10 text-falah-accent"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t("products.fruits")}
            </button>
          </div>
        </div>
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
