import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import type { ProductSummary } from "../../types/inventory";
import { getProductDisplayLabel } from "../../utils/sellCalculations";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productId: string, quantityKg: number) => boolean;
  products: ProductSummary[];
  existingProductIds: string[];
}

export default function AddStockModal({
  isOpen,
  onClose,
  onSubmit,
  products,
  existingProductIds,
}: AddStockModalProps) {
  const available = products.filter((p) => !existingProductIds.includes(p.id));
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setProductId(available[0]?.id ?? "");
      setQuantity("");
      setError("");
    }
  }, [isOpen, available]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(quantity);
    if (!productId) {
      setError(t("suppliers.selectProductRequired"));
      return;
    }
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError(t("suppliers.qtyInvalid"));
      return;
    }
    const ok = onSubmit(productId, parsed);
    if (!ok) {
      setError(t("suppliers.alreadyInStock"));
      return;
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("suppliers.addStockTitle")}
      subtitle={t("suppliers.addStockSubtitle")}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-white">
            {t("common.cancel")}
          </button>
          <button type="submit" form="add-stock-form" disabled={available.length === 0} className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50">
            {t("suppliers.addToStock")}
          </button>
        </div>
      }
    >
      {available.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("suppliers.noProductsAvailable")}</p>
      ) : (
        <form id="add-stock-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="stock-product" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t("common.product")}</label>
            <select id="stock-product" value={productId} onChange={(e) => { setProductId(e.target.value); setError(""); }} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15">
              {available.map((p) => (
                <option key={p.id} value={p.id}>{getProductDisplayLabel(p)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="stock-qty" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{t("suppliers.qtyKg")}</label>
            <input id="stock-qty" type="number" step="0.01" min="0" value={quantity} onChange={(e) => { setQuantity(e.target.value); setError(""); }} placeholder="e.g. 500" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15" />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        </form>
      )}
    </Modal>
  );
}
