import { motion } from "framer-motion";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import { formatDate, formatWeight } from "../../utils/format";
import type { SupplyBatch } from "../../types/inventory";

interface SupplyBatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: SupplyBatch | null;
}

export default function SupplyBatchDetailsModal({
  isOpen,
  onClose,
  batch,
}: SupplyBatchDetailsModalProps) {
  if (!batch) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("tasalom.supplyDetails")}
      subtitle={`${batch.supplierName} · ${formatDate(batch.createdAt)}`}
      size="md"
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="falah-table w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-start font-semibold text-gray-700 dark:text-white">
                  {t("common.product")}
                </th>
                <th className="px-4 py-3 text-start font-semibold text-gray-700 dark:text-white">
                  {t("suppliers.qtyKg")}
                </th>
              </tr>
            </thead>
            <tbody>
              {batch.lines.map((line, index) => (
                <motion.tr
                  key={line.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-50 last:border-0 dark:border-gray-800"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {line.productName}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-600">
                    {formatWeight(line.quantityKg)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-brand-50/40 dark:border-gray-700 dark:bg-brand-500/10">
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                  {t("common.totals")}
                </td>
                <td className="px-4 py-3 font-bold text-brand-600">
                  {formatWeight(batch.totalQuantityKg)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Modal>
  );
}
