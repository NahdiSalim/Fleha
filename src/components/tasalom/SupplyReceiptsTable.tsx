import { useState } from "react";
import { motion } from "framer-motion";
import { t } from "../../i18n";
import { EyeIcon } from "../../icons";
import type { ProductSummary, SupplierSummary, SupplyBatch } from "../../types/inventory";
import { formatDate, formatWeight } from "../../utils/format";
import SearchableSelect from "../ui/SearchableSelect";
import SupplyBatchDetailsModal from "./SupplyBatchDetailsModal";

interface SupplyReceiptsTableProps {
  batches: SupplyBatch[];
  supplierFilter: string;
  productFilter: string;
  suppliers: SupplierSummary[];
  products: ProductSummary[];
  onSupplierFilterChange: (value: string) => void;
  onProductFilterChange: (value: string) => void;
}

export default function SupplyReceiptsTable({
  batches,
  supplierFilter,
  productFilter,
  suppliers,
  products,
  onSupplierFilterChange,
  onProductFilterChange,
}: SupplyReceiptsTableProps) {
  const [selectedBatch, setSelectedBatch] = useState<SupplyBatch | null>(null);

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.name,
  }));
  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("common.supplier")}
          </label>
          <SearchableSelect
            value={supplierFilter}
            onChange={onSupplierFilterChange}
            options={supplierOptions}
            placeholder={t("tasalom.allSuppliers")}
            emptyOption={{ value: "", label: t("tasalom.allSuppliers") }}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("common.product")}
          </label>
          <SearchableSelect
            value={productFilter}
            onChange={onProductFilterChange}
            options={productOptions}
            placeholder={t("tasalom.allProducts")}
            emptyOption={{ value: "", label: t("tasalom.allProducts") }}
          />
        </div>
      </div>

      {batches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900"
        >
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {t("tasalom.noReceiptsYet")}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("tasalom.noReceiptsHint")}
          </p>
        </motion.div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="hidden overflow-x-auto md:block">
            <table className="falah-table text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:border-gray-800 dark:from-brand-500/15 dark:to-falah-accent/15">
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                    {t("common.date")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                    {t("common.supplier")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                    {t("tasalom.productsCount")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                    {t("suppliers.qtyKg")}
                  </th>
                  <th className="px-6 py-4 text-end font-semibold text-gray-700 dark:text-white">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, index) => (
                  <motion.tr
                    key={batch.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-50/30 dark:hover:bg-gray-800/60"
                  >
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-200">
                      {formatDate(batch.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {batch.supplierName}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                      {t("tasalom.productCount", { count: batch.productCount })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-600">
                      {formatWeight(batch.totalQuantityKg)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedBatch(batch)}
                          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                        >
                          <EyeIcon className="action-icon" />
                          <span>{t("common.details")}</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 p-4 md:hidden">
            {batches.map((batch, index) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {batch.supplierName}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(batch.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBatch(batch)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                  >
                    <EyeIcon className="action-icon" />
                    <span>{t("common.details")}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("tasalom.productsCount")}
                    </p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">
                      {t("tasalom.productCount", { count: batch.productCount })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("suppliers.qtyKg")}
                    </p>
                    <p className="mt-1 font-semibold text-brand-600">
                      {formatWeight(batch.totalQuantityKg)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <SupplyBatchDetailsModal
        isOpen={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        batch={selectedBatch}
      />
    </>
  );
}
