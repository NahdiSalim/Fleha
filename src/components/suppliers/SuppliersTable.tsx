import { motion } from "framer-motion";
import { Link } from "react-router";
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";
import { t } from "../../i18n";
import { formatWeight } from "../../utils/format";
import type { SupplierSummary } from "../../types/inventory";

interface SuppliersTableProps {
  suppliers: SupplierSummary[];
  onEdit: (supplier: SupplierSummary) => void;
  onDelete: (supplier: SupplierSummary) => void;
}

export default function SuppliersTable({
  suppliers,
  onEdit,
  onDelete,
}: SuppliersTableProps) {
  if (suppliers.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("suppliers.noSuppliersYet")}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("suppliers.noSuppliersHint")}</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
        <table className="falah-table text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:from-brand-500/15 dark:to-falah-accent/15">
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.fullName")}</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.phone")}</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("suppliers.productsInStock")}</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.totalStock")}</th>
              <th className="px-6 py-4 text-end font-semibold text-gray-700 dark:text-white">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <motion.tr key={supplier.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-50/30 dark:hover:bg-gray-800/60">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                      {supplier.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{supplier.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-200">{supplier.phone}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-100">{supplier.productCount}</td>
                <td className="px-6 py-4 font-medium text-falah-accent">{formatWeight(supplier.totalStockKg)}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link to={`/suppliers/${supplier.id}`} className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-600">
                      <EyeIcon className="action-icon" /><span>{t("common.details")}</span>
                    </Link>
                    <button onClick={() => onEdit(supplier)} className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600">
                      <PencilIcon className="action-icon" /><span>{t("common.edit")}</span>
                    </button>
                    <button onClick={() => onDelete(supplier)} className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50">
                      <TrashBinIcon className="action-icon" /><span>{t("common.delete")}</span>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {suppliers.map((supplier, index) => (
          <motion.div key={supplier.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3">
              <p className="font-semibold text-white">{supplier.name}</p>
              <p className="text-xs text-white/70">{supplier.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-100 p-px">
              <div className="bg-white p-3 text-center dark:bg-gray-900">
                <p className="text-[10px] uppercase text-gray-400">{t("common.product")}</p>
                <p className="mt-0.5 text-xs font-semibold">{supplier.productCount}</p>
              </div>
              <div className="bg-white p-3 text-center dark:bg-gray-900">
                <p className="text-[10px] uppercase text-gray-400">{t("common.totalStock")}</p>
                <p className="mt-0.5 text-xs font-semibold text-falah-accent">{formatWeight(supplier.totalStockKg)}</p>
              </div>
            </div>
            <div className="flex gap-2 p-3">
              <Link to={`/suppliers/${supplier.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 text-xs font-medium text-white">
                <EyeIcon className="action-icon" /><span>{t("common.details")}</span>
              </Link>
              <button onClick={() => onEdit(supplier)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 dark:text-gray-200">
                <PencilIcon className="action-icon" /><span>{t("common.edit")}</span>
              </button>
              <button onClick={() => onDelete(supplier)} className="rounded-lg border border-red-100 px-3 py-2 text-red-500">
                <TrashBinIcon className="action-icon" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
