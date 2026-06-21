import { motion } from "framer-motion";
import {
  DocsIcon,
  DollarLineIcon,
  EyeIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatDate } from "../../utils/format";
import type { Invoice } from "../../types/clients";
import StatusBadge from "./StatusBadge";

interface InvoicesTableProps {
  invoices: Invoice[];
  onViewDetails: (invoice: Invoice) => void;
  onEditBalance: (invoice: Invoice) => void;
  onPrint: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
}

export default function InvoicesTable({
  invoices,
  onViewDetails,
  onEditBalance,
  onPrint,
  onDelete,
}: InvoicesTableProps) {
  if (invoices.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-falah-accent/10 text-falah-accent">
          <DocsIcon className="action-icon-md" />
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("invoiceTable.noInvoices")}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("invoiceTable.noInvoicesHint")}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
        <div className="overflow-x-auto">
          <table className="falah-table min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:from-brand-500/15 dark:to-falah-accent/15">
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("invoiceTable.invoiceId")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("common.date")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("invoiceTable.total")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("invoiceTable.paid")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("invoiceTable.balanceDue")}</th>
                <th className="px-5 py-4 font-semibold text-gray-700 dark:text-white">{t("invoiceTable.status")}</th>
                <th className="min-w-[320px] px-5 py-4 font-semibold text-gray-700 dark:text-white text-end">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 dark:border-gray-800 transition hover:bg-brand-50/30 dark:hover:bg-gray-800/60"
                >
                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-xs font-semibold text-brand-700">
                      {invoice.invoiceId}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-200">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-5 py-4 font-medium text-emerald-600">
                    {formatCurrency(invoice.paid)}
                  </td>
                  <td className="px-5 py-4 font-semibold text-falah-accent">
                    {formatCurrency(invoice.balanceDue)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditBalance(invoice)}
                        title={t("invoiceTable.editBalanceTitle")}
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-falah-accent/30 bg-falah-accent/5 px-2.5 py-1.5 text-xs font-medium text-falah-accent transition hover:bg-falah-accent/10"
                      >
                        <DollarLineIcon className="action-icon" />
                        <span>{t("invoiceTable.balance")}</span>
                      </button>
                      <button
                        onClick={() => onViewDetails(invoice)}
                        title={t("invoiceTable.viewDetailsTitle")}
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                      >
                        <EyeIcon className="action-icon" />
                        <span>{t("common.details")}</span>
                      </button>
                      <button
                        onClick={() => onPrint(invoice)}
                        title={t("invoiceTable.printTitle")}
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <DocsIcon className="action-icon" />
                        <span>{t("invoiceTable.print")}</span>
                      </button>
                      <button
                        onClick={() => onDelete(invoice)}
                        title={t("invoiceTable.deleteTitle")}
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
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
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-500/10 to-falah-accent/10 px-4 py-3">
              <span className="font-mono text-sm font-bold text-brand-700">
                {invoice.invoiceId}
              </span>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-300">{t("common.date")}</p>
                <p className="font-medium">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-300">{t("invoiceTable.total")}</p>
                <p className="font-medium">{formatCurrency(invoice.total)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-300">{t("invoiceTable.paid")}</p>
                <p className="font-medium text-emerald-600">
                  {formatCurrency(invoice.paid)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-300">{t("invoiceTable.balanceDue")}</p>
                <p className="font-semibold text-falah-accent">
                  {formatCurrency(invoice.balanceDue)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-gray-100 p-3">
              <button
                onClick={() => onEditBalance(invoice)}
                className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-falah-accent/10 py-2 text-xs font-medium text-falah-accent"
              >
                <PencilIcon className="action-icon" />
                <span>{t("invoiceTable.balance")}</span>
              </button>
              <button
                onClick={() => onViewDetails(invoice)}
                className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 py-2 text-xs font-medium text-white"
              >
                <EyeIcon className="action-icon" />
                <span>{t("common.details")}</span>
              </button>
              <button
                onClick={() => onPrint(invoice)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-200"
              >
                <DocsIcon className="action-icon" />
                <span>{t("invoiceTable.print")}</span>
              </button>
              <button
                onClick={() => onDelete(invoice)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-500"
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
