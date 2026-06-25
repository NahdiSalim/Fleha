import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import StatCard from "../../components/clients/StatCard";
import TransactionFormModal from "../../components/khazina/TransactionFormModal";
import TransactionsTable from "../../components/khazina/TransactionsTable";
import { useTreasury } from "../../context/TreasuryContext";
import { t } from "../../i18n";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarLineIcon,
  ListIcon,
  PlusIcon,
} from "../../icons";
import { formatCurrency } from "../../utils/format";

export default function KhazinaPage() {
  const {
    transactions,
    currentBalance,
    totalIn,
    totalOut,
    addTransaction,
  } = useTreasury();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const latestTransactionDate = useMemo(() => {
    if (transactions.length === 0) return t("khazina.noTransactionsYet");
    return new Intl.DateTimeFormat("ar-TN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(transactions[0].createdAt));
  }, [transactions]);

  return (
    <>
      <PageMeta
        title={t("meta.khazina")}
        description={t("khazina.subtitle")}
      />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl"
            >
              {t("khazina.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {t("khazina.subtitle")}
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
          >
            <PlusIcon className="h-4 w-4" /> {t("khazina.addTransaction")}
          </motion.button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("khazina.currentBalance")}
            value={formatCurrency(currentBalance)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="primary"
            delay={0}
          />
          <StatCard
            label={t("khazina.totalIn")}
            value={formatCurrency(totalIn)}
            icon={<ArrowDownIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.05}
          />
          <StatCard
            label={t("khazina.totalOut")}
            value={formatCurrency(totalOut)}
            icon={<ArrowUpIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.1}
          />
          <StatCard
            label={t("khazina.transactionsCount")}
            value={String(transactions.length)}
            icon={<ListIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.15}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-500/5 to-falah-accent/5 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:from-brand-500/10 dark:to-falah-accent/10"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("khazina.latestTransaction")}
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
            {latestTransactionDate}
          </p>
        </motion.div>

        <TransactionsTable transactions={transactions} />
      </AnimatedPage>

      <TransactionFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={addTransaction}
      />
    </>
  );
}
