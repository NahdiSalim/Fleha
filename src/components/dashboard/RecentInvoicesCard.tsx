import { motion } from "framer-motion";
import { Link } from "react-router";
import { t } from "../../i18n";
import { formatCurrency, formatDate } from "../../utils/format";
import type { Invoice } from "../../types/clients";
import StatusBadge from "../clients/StatusBadge";

interface RecentInvoicesCardProps {
  invoices: Invoice[];
  getClientName: (clientId: string) => string;
}

export default function RecentInvoicesCard({
  invoices,
  getClientName,
}: RecentInvoicesCardProps) {
  const recent = invoices.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5 py-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">{t("dashboard.recentInvoices")}</h2>
        <Link to="/clients" className="text-xs font-medium text-brand-500 hover:underline">
          {t("common.viewAll")}
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          {t("dashboard.noInvoicesYet")}{" "}
          <Link to="/sell" className="font-medium text-brand-500 hover:underline">
            {t("dashboard.createOne")}
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {recent.map((inv) => (
            <Link
              key={inv.id}
              to={`/clients/${inv.clientId}`}
              className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-brand-50/30"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold text-brand-700">
                  {inv.invoiceId}
                </p>
                <p className="truncate text-sm text-gray-800">
                  {getClientName(inv.clientId)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(inv.date)}</p>
              </div>
              <div className="shrink-0 text-end">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(inv.total)}
                </p>
                <div className="mt-1">
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
