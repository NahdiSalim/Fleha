import { motion } from "framer-motion";
import { t } from "../../i18n";
import type { TreasuryTransaction } from "../../types/treasury";
import { formatCurrency, formatDate } from "../../utils/format";

interface TransactionsTableProps {
  transactions: TreasuryTransaction[];
}

function TransactionTypeBadge({
  type,
}: {
  type: TreasuryTransaction["type"];
}) {
  const className =
    type === "in"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-red-50 text-red-600";

  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {type === "in" ? t("khazina.moneyIn") : t("khazina.moneyOut")}
    </span>
  );
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900"
      >
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {t("khazina.noTransactionsYet")}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("khazina.noTransactionsHint")}
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
        <table className="falah-table text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:border-gray-800 dark:from-brand-500/15 dark:to-falah-accent/15">
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                {t("common.date")}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                {t("khazina.transactionType")}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                {t("khazina.amount")}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                {t("khazina.user")}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                {t("khazina.beneficiary")}
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                {t("khazina.note")}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-brand-50/30 dark:hover:bg-gray-800/60"
              >
                <td className="px-6 py-4 text-gray-600 dark:text-gray-200">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <TransactionTypeBadge type={transaction.type} />
                </td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    transaction.type === "in"
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                  {transaction.user}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                  {transaction.beneficiary}
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-300">
                  {transaction.note || "—"}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(transaction.createdAt)}
              </p>
              <TransactionTypeBadge type={transaction.type} />
            </div>
            <p
              className={`mt-2 text-lg font-bold ${
                transaction.type === "in"
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {formatCurrency(transaction.amount)}
            </p>
            <p className="mt-2 text-sm text-gray-900 dark:text-white">
              {transaction.beneficiary}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t("khazina.user")}: {transaction.user}
            </p>
            {transaction.note && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                {transaction.note}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}
