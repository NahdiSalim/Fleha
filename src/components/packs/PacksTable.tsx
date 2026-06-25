import { motion } from "framer-motion";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatWeight } from "../../utils/format";
import type { Pack } from "../../types/inventory";

interface PacksTableProps {
  packs: Pack[];
  onEdit: (pack: Pack) => void;
  onDelete: (pack: Pack) => void;
}

export default function PacksTable({
  packs,
  onEdit,
  onDelete,
}: PacksTableProps) {
  if (packs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900"
      >
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("packs.noPacksYet")}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("packs.noPacksHint")}</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
        <table className="falah-table text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:from-brand-500/15 dark:to-falah-accent/15">
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.name")}</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.weight")}</th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("packs.packPrice")}</th>
              <th className="px-6 py-4 text-end font-semibold text-gray-700 dark:text-white">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {packs.map((pack, index) => (
              <motion.tr
                key={pack.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-50/30 dark:hover:bg-gray-800/60"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-sm font-bold text-brand-600">
                      {pack.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{pack.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-100">
                  {formatWeight(pack.weight)}
                </td>
                <td className="px-6 py-4 font-semibold text-brand-600">
                  {formatCurrency(pack.price)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(pack)}
                      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <PencilIcon className="action-icon" />
                      <span>{t("common.edit")}</span>
                    </button>
                    <button
                      onClick={() => onDelete(pack)}
                      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <TrashBinIcon className="action-icon" />
                      <span>{t("common.delete")}</span>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {packs.map((pack, index) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{pack.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatWeight(pack.weight)}</p>
              </div>
              <p className="font-semibold text-brand-600">{formatCurrency(pack.price)}</p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(pack)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 dark:text-gray-200"
              >
                <PencilIcon className="action-icon" />
                <span>{t("common.edit")}</span>
              </button>
              <button
                onClick={() => onDelete(pack)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-xs font-medium text-red-500"
              >
                <TrashBinIcon className="action-icon" />
                <span>{t("common.delete")}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
