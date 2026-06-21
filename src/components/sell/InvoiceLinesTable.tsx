import { motion, AnimatePresence } from "framer-motion";
import { TrashBinIcon } from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatWeight } from "../../utils/format";
import type { ProductSummary } from "../../types/inventory";
import type { SellLineItem } from "../../types/templates";
import {
  getProductDisplayLabel,
  packNameToUnitType,
  recalculateLine,
} from "../../utils/sellCalculations";
import PackBadge from "./PackBadge";

interface InvoiceLinesTableProps {
  lines: SellLineItem[];
  products: ProductSummary[];
  suppliersForProduct: (productId: string) => string[];
  onChange: (lines: SellLineItem[]) => void;
  onDropProduct: (productId: string) => void;
}

const inputClass =
  "w-full min-w-0 rounded-lg border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export default function InvoiceLinesTable({
  lines,
  products,
  suppliersForProduct,
  onChange,
  onDropProduct,
}: InvoiceLinesTableProps) {
  const updateLine = (id: string, patch: Partial<SellLineItem>) => {
    onChange(
      lines.map((line) => {
        if (line.id !== id) return line;
        return recalculateLine({ ...line, ...patch });
      })
    );
  };

  const changeProduct = (id: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const suppliers = suppliersForProduct(productId);
    onChange(
      lines.map((line) => {
        if (line.id !== id) return line;
        return recalculateLine({
          ...line,
          productId: product.id,
          productName: product.name,
          unitType: packNameToUnitType(product.packName),
          packWeight: product.packWeight,
          pricePerKg: product.pricePerKg,
          supplier: suppliers[0] ?? line.supplier,
        });
      })
    );
  };

  const removeLine = (id: string) => {
    onChange(lines.filter((l) => l.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const productId = e.dataTransfer.getData("productId");
    if (productId) onDropProduct(productId);
  };

  const totals = lines.reduce(
    (acc, l) => ({
      net: acc.net + l.lineNetWeight,
      gross: acc.gross + l.lineGrossWeight,
      amount: acc.amount + l.total,
    }),
    { net: 0, gross: 0, amount: 0 }
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 transition hover:border-brand-300/50"
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
            {t("sellTable.emptyHint")}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 dark:text-gray-300">
            {t("sellTable.emptyFormula")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="falah-table min-w-[1100px] text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:from-brand-500/15 dark:to-falah-accent/15">
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.product")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("common.pack")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.quantity")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.packCount")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.unitNet")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.unitGross")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.packWt")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.netTotal")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.priceKg")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.lineTotal")}</th>
                <th className="px-3 py-3 font-semibold text-gray-700 dark:text-white">{t("sellTable.supplier")}</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {lines.map((line, index) => {
                  const supplierOptions = suppliersForProduct(line.productId);
                  return (
                    <motion.tr
                      key={line.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-50/20"
                    >
                      <td className="px-3 py-2">
                        <select
                          value={line.productId}
                          onChange={(e) => changeProduct(line.id, e.target.value)}
                          className={inputClass}
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {getProductDisplayLabel(p)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <PackBadge packName={products.find((p) => p.id === line.productId)?.packName ?? line.unitType} size="xs" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" step="1" value={line.quantity} onChange={(e) => updateLine(line.id, { quantity: parseFloat(e.target.value) || 0 })} className={inputClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" step="1" value={line.packCount} onChange={(e) => updateLine(line.id, { packCount: parseFloat(e.target.value) || 0 })} className={inputClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" step="0.01" value={line.unitNetWeight} onChange={(e) => updateLine(line.id, { unitNetWeight: parseFloat(e.target.value) || 0 })} className={inputClass} />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" step="0.01" value={line.unitGrossWeight} onChange={(e) => updateLine(line.id, { unitGrossWeight: parseFloat(e.target.value) || 0 })} className={inputClass} />
                      </td>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-300">{formatWeight(line.packWeight)}</td>
                      <td className="px-3 py-2 font-medium text-gray-800 dark:text-white">{formatWeight(line.lineNetWeight)}</td>
                      <td className="px-3 py-2">
                        <input type="number" min="0" step="0.01" value={line.pricePerKg} onChange={(e) => updateLine(line.id, { pricePerKg: parseFloat(e.target.value) || 0 })} className={inputClass} />
                      </td>
                      <td className="px-3 py-2 font-semibold text-brand-600">{formatCurrency(line.total)}</td>
                      <td className="px-3 py-2">
                        <select value={line.supplier} onChange={(e) => updateLine(line.id, { supplier: e.target.value })} className={inputClass}>
                          <option value="">—</option>
                          {supplierOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <button type="button" onClick={() => removeLine(line.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50" title={t("sellTable.remove")}>
                          <TrashBinIcon className="action-icon" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-800 font-semibold">
                <td colSpan={7} className="px-3 py-3 text-end text-gray-600 dark:text-gray-200">{t("common.totals")}</td>
                <td className="px-3 py-3">{formatWeight(Math.round(totals.net * 100) / 100)}</td>
                <td className="px-3 py-3" />
                <td className="px-3 py-3 text-brand-600 dark:text-brand-400">{formatCurrency(Math.round(totals.amount * 100) / 100)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
