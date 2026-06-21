import { motion } from "framer-motion";
import { t } from "../../i18n";
import { formatCurrency } from "../../utils/format";

interface PaymentOverviewProps {
  totalInvoiced: number;
  totalPaid: number;
  balanceDue: number;
  paidCount: number;
  partialCount: number;
}

export default function PaymentOverview({
  totalInvoiced,
  totalPaid,
  balanceDue,
  paidCount,
  partialCount,
}: PaymentOverviewProps) {
  const paidPercent =
    totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;
  const duePercent = totalInvoiced > 0 ? 100 - paidPercent : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">{t("dashboard.paymentOverview")}</h2>

      <div className="mb-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div className="flex h-full">
          <div
            className="bg-emerald-500 transition-all duration-700"
            style={{ width: `${paidPercent}%` }}
          />
          <div
            className="bg-falah-accent transition-all duration-700"
            style={{ width: `${duePercent}%` }}
          />
        </div>
      </div>

      <div className="mb-4 flex justify-between text-xs">
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t("dashboard.collectedPercent", { percent: paidPercent })}
        </span>
        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
          <span className="h-2 w-2 rounded-full bg-falah-accent" />
          {t("dashboard.outstandingPercent", { percent: duePercent })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-500/10">
          <p className="text-xs text-emerald-700 dark:text-emerald-400">{t("dashboard.collected")}</p>
          <p className="mt-0.5 text-lg font-bold text-emerald-800 dark:text-emerald-300">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="rounded-xl bg-falah-accent/10 p-3 dark:bg-falah-accent/15">
          <p className="text-xs text-falah-accent dark:text-falah-accent-light">{t("dashboard.outstanding")}</p>
          <p className="mt-0.5 text-lg font-bold text-falah-accent-dark dark:text-falah-accent-light">
            {formatCurrency(balanceDue)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
        <div>
          <span className="text-gray-500 dark:text-gray-400">{t("dashboard.paidInvoices")}</span>
          <p className="font-semibold text-gray-900 dark:text-white">{paidCount}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">{t("dashboard.partialInvoices")}</span>
          <p className="font-semibold text-gray-900 dark:text-white">{partialCount}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">{t("common.totalInvoiced")}</span>
          <p className="font-semibold text-brand-600 dark:text-brand-400">
            {formatCurrency(totalInvoiced)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
