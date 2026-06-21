import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import { formatWeight } from "../../utils/format";
import type { StockItemSummary } from "../../types/inventory";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItemSummary | null;
  onConfirm: (quantityKg: number) => void;
}

export default function AdjustStockModal({
  isOpen,
  onClose,
  item,
  onConfirm,
}: AdjustStockModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && item) {
      setAmount(String(item.quantityKg));
      setError("");
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (Number.isNaN(parsed) || parsed < 0) {
      setError(t("suppliers.qtyInvalid"));
      return;
    }
    onConfirm(parsed);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("suppliers.adjustTitle")}
      subtitle={t("suppliers.adjustCurrent", { name: item.productName, current: formatWeight(item.quantityKg) })}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-white">
            {t("common.cancel")}
          </button>
          <button type="submit" form="adjust-stock-form" className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600">
            {t("common.save")}
          </button>
        </div>
      }
    >
      <form id="adjust-stock-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="adjust-amount" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("suppliers.qtyKg")}
          </label>
          <input
            id="adjust-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(""); }}
            autoFocus
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </form>
    </Modal>
  );
}
