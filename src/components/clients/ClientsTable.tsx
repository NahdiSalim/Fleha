import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  EyeIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatInvoiceCount } from "../../utils/format";
import type { ClientSummary } from "../../types/clients";

interface ClientsTableProps {
  clients: ClientSummary[];
  onEdit: (client: ClientSummary) => void;
  onDelete: (client: ClientSummary) => void;
}

export default function ClientsTable({
  clients,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("clients.noClientsYet")}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("clients.noClientsHint")}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
        <div className="overflow-x-auto">
          <table className="falah-table text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:from-brand-500/15 dark:to-falah-accent/15">
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.fullName")}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.totalInvoiced")}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.totalPaid")}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">{t("common.balanceDue")}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white text-end">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group border-b border-gray-50 dark:border-gray-800 transition hover:bg-brand-50/30 dark:hover:bg-gray-800/60"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-300">
                          {formatInvoiceCount(client.invoiceCount)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-100">
                    {formatCurrency(client.totalInvoiced)}
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-600">
                    {formatCurrency(client.totalPaid)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        client.balanceDue > 0 ? "text-falah-accent" : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {formatCurrency(client.balanceDue)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        to={`/clients/${client.id}`}
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-600"
                      >
                        <EyeIcon className="action-icon" />
                        <span>{t("common.details")}</span>
                      </Link>
                      <button
                        onClick={() => onEdit(client)}
                        className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <PencilIcon className="action-icon" />
                        <span>{t("common.edit")}</span>
                      </button>
                      <button
                        onClick={() => onDelete(client)}
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
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{client.name}</p>
                  <p className="text-xs text-white/70">
                    {formatInvoiceCount(client.invoiceCount)}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-gray-100 p-px dark:bg-gray-800">
              <div className="bg-white p-3 text-center dark:bg-gray-900">
                <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 dark:text-gray-300">{t("clients.shortInvoiced")}</p>
                <p className="mt-0.5 text-xs font-semibold text-gray-800 dark:text-white">
                  {formatCurrency(client.totalInvoiced)}
                </p>
              </div>
              <div className="bg-white p-3 text-center dark:bg-gray-900">
                <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 dark:text-gray-300">{t("clients.shortPaid")}</p>
                <p className="mt-0.5 text-xs font-semibold text-emerald-600">
                  {formatCurrency(client.totalPaid)}
                </p>
              </div>
              <div className="bg-white p-3 text-center dark:bg-gray-900">
                <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500 dark:text-gray-300">{t("clients.shortDue")}</p>
                <p className="mt-0.5 text-xs font-semibold text-falah-accent">
                  {formatCurrency(client.balanceDue)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 p-3">
              <Link
                to={`/clients/${client.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 py-2 text-xs font-medium text-white"
              >
                <EyeIcon className="action-icon" />
                <span>{t("common.details")}</span>
              </Link>
              <button
                onClick={() => onEdit(client)}
                className="flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 dark:text-gray-200"
              >
                <PencilIcon className="action-icon" />
                <span>{t("common.edit")}</span>
              </button>
              <button
                onClick={() => onDelete(client)}
                className="flex items-center justify-center rounded-lg border border-red-100 px-3 py-2 text-red-500"
              >
                <TrashBinIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
