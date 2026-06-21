import { motion } from "framer-motion";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatWeight } from "../../utils/format";
import type { StockItemSummary } from "../../types/inventory";

interface StockTableProps {
  stock: StockItemSummary[];
  onAddStock: () => void;
  onSet: (item: StockItemSummary) => void;
  onDelete: (item: StockItemSummary) => void;
}

export default function StockTable({
  stock,
  onAddStock,
  onSet,
  onDelete,
}: StockTableProps) {
  if (stock.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("suppliers.noStockYet")}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("suppliers.noStockHint")}</p>
        <button onClick={onAddStock} className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600">
          {t("products.addProduct")}
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <div className="hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
        <div className="overflow-x-auto">
          <table className="falah-table min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:from-brand-500/15 dark:to-falah-accent/15">
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("common.product")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("common.pack")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("common.pricePerKg")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("suppliers.qtyKg")}</th>
                <th className="min-w-[200px] px-5 py-4 text-end font-semibold text-gray-700 dark:text-white">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-50/30 dark:hover:bg-gray-800/60">
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{item.productName}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-falah-accent/10 px-2 py-0.5 text-xs font-medium text-falah-accent">{item.packName}</span>
                  </td>
                  <td className="px-5 py-4 text-brand-600">{formatCurrency(item.pricePerKg)}</td>
                  <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">{formatWeight(item.quantityKg)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <button onClick={() => onSet(item)} className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600">
                        <PencilIcon className="action-icon" /><span>{t("common.setQty")}</span>
                      </button>
                      <button onClick={() => onDelete(item)} className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
                        <TrashBinIcon className="action-icon" /><span>{t("common.delete")}</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {stock.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.productName}</p>
                <p className="text-xs text-falah-accent">{item.packName}</p>
              </div>
              <p className="font-bold text-gray-800 dark:text-white">{formatWeight(item.quantityKg)}</p>
            </div>
            <p className="mt-1 text-sm text-brand-600">{formatCurrency(item.pricePerKg)}/{t("common.kg")}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onSet(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 dark:text-gray-200">
                <PencilIcon className="action-icon" /><span>{t("common.setQty")}</span>
              </button>
              <button onClick={() => onDelete(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-xs font-medium text-red-500">
                <TrashBinIcon className="action-icon" /><span>{t("common.delete")}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
