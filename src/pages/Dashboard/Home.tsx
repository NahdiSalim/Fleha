import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import StatCard from "../../components/clients/StatCard";
import KhazinaDayStatCard from "../../components/dashboard/KhazinaDayStatCard";
import KhazinaHeroCard from "../../components/dashboard/KhazinaHeroCard";
import PaymentOverview from "../../components/dashboard/PaymentOverview";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentInvoicesCard from "../../components/dashboard/RecentInvoicesCard";
import { useClients } from "../../context/ClientsContext";
import { useInventory } from "../../context/InventoryContext";
import { useTemplates } from "../../context/TemplatesContext";
import { useTreasury } from "../../context/TreasuryContext";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxCubeIcon,
  BoxIcon,
  CalenderIcon,
  DollarLineIcon,
  DocsIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
  PlusIcon,
  UserCircleIcon,
} from "../../icons";
import { t } from "../../i18n";
import {
  formatCurrency,
  formatDateInputLabel,
  formatWeight,
  getDateInputValue,
  getTodayDateInput,
} from "../../utils/format";

export default function Home() {
  const { clients, invoices, getClient } = useClients();
  const { products, suppliers, packs } = useInventory();
  const { templates } = useTemplates();
  const { transactions, currentBalance } = useTreasury();
  const [dateFilter, setDateFilter] = useState(() => getTodayDateInput());

  const isToday = dateFilter === getTodayDateInput();

  const dayTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => getDateInputValue(transaction.createdAt) === dateFilter
      ),
    [transactions, dateFilter]
  );

  const dayStats = useMemo(() => {
    const totals = dayTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "in") {
          acc.totalIn += transaction.amount;
        } else {
          acc.totalOut += transaction.amount;
        }
        return acc;
      },
      { totalIn: 0, totalOut: 0 }
    );

    return {
      totalIn: Math.round(totals.totalIn * 100) / 100,
      totalOut: Math.round(totals.totalOut * 100) / 100,
      net: Math.round((totals.totalIn - totals.totalOut) * 100) / 100,
      count: dayTransactions.length,
    };
  }, [dayTransactions]);

  const stats = useMemo(() => {
    const totalInvoiced = clients.reduce((s, c) => s + c.totalInvoiced, 0);
    const totalPaid = clients.reduce((s, c) => s + c.totalPaid, 0);
    const balanceDue = clients.reduce((s, c) => s + c.balanceDue, 0);
    const totalStock = suppliers.reduce((s, sup) => s + sup.totalStockKg, 0);
    const paidCount = invoices.filter((i) => i.status === "paid").length;
    const partialCount = invoices.filter((i) => i.status === "partially_paid").length;

    return {
      totalInvoiced,
      totalPaid,
      balanceDue,
      totalStock,
      paidCount,
      partialCount,
    };
  }, [clients, invoices, suppliers]);

  const getClientName = (clientId: string) =>
    getClient(clientId)?.name ?? t("common.unknownClient");

  return (
    <>
      <PageMeta
        title={t("meta.dashboard")}
        description={t("dashboard.subtitle")}
      />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl"
            >
              {t("dashboard.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {t("dashboard.subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="flex flex-wrap items-center gap-2"
          >
            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-none">
              <CalenderIcon className="h-5 w-5 shrink-0 text-brand-500" />
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="w-full bg-transparent text-sm outline-none dark:text-white"
              />
            </div>
            {!isToday && (
              <button
                type="button"
                onClick={() => setDateFilter(getTodayDateInput())}
                className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
              >
                {t("dashboard.today")}
              </button>
            )}
            <Link
              to="/khazina"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:shadow-brand-500/40"
            >
              <PlusIcon className="h-4 w-4" />
              {t("khazina.addTransaction")}
            </Link>
          </motion.div>
        </div>

        {/* Khazina focus */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t("nav.khazina")}
        </p>
        <div className="mb-4">
          <KhazinaHeroCard
            label={t("khazina.currentBalance")}
            value={formatCurrency(currentBalance)}
            icon={<DollarLineIcon className="h-8 w-8" />}
            delay={0}
          />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {isToday
            ? t("dashboard.todaySummary")
            : t("dashboard.daySummary", { date: formatDateInputLabel(dateFilter) })}
        </p>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KhazinaDayStatCard
            label={t("khazina.totalIn")}
            value={formatCurrency(dayStats.totalIn)}
            icon={<ArrowDownIcon className="h-5 w-5" />}
            tone="in"
            delay={0.05}
          />
          <KhazinaDayStatCard
            label={t("khazina.totalOut")}
            value={formatCurrency(dayStats.totalOut)}
            icon={<ArrowUpIcon className="h-5 w-5" />}
            tone="out"
            delay={0.1}
          />
          <KhazinaDayStatCard
            label={t("dashboard.dayNet")}
            value={formatCurrency(dayStats.net)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            tone="accent"
            delay={0.15}
          />
          <KhazinaDayStatCard
            label={t("khazina.transactionsCount")}
            value={String(dayStats.count)}
            icon={<ListIcon className="h-5 w-5" />}
            tone="neutral"
            delay={0.2}
          />
        </div>

        {/* Finance overview */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t("dashboard.finance")}
        </p>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("common.totalInvoiced")}
            value={formatCurrency(stats.totalInvoiced)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.1}
          />
          <StatCard
            label={t("common.totalCollected")}
            value={formatCurrency(stats.totalPaid)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.15}
          />
          <StatCard
            label={t("common.outstandingBalance")}
            value={formatCurrency(stats.balanceDue)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.2}
          />
          <StatCard
            label={t("common.invoices")}
            value={String(invoices.length)}
            icon={<DocsIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.25}
          />
        </div>

        {/* Business overview */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t("dashboard.business")}
        </p>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("nav.clients")}
            value={String(clients.length)}
            icon={<GroupIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.15}
          />
          <StatCard
            label={t("nav.products")}
            value={String(products.length)}
            icon={<BoxCubeIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.2}
          />
          <StatCard
            label={t("nav.suppliers")}
            value={String(suppliers.length)}
            icon={<UserCircleIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.25}
          />
          <StatCard
            label={t("common.totalStock")}
            value={formatWeight(stats.totalStock)}
            icon={<BoxIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.3}
          />
        </div>

        {/* Details row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <PaymentOverview
              totalInvoiced={stats.totalInvoiced}
              totalPaid={stats.totalPaid}
              balanceDue={stats.balanceDue}
              paidCount={stats.paidCount}
              partialCount={stats.partialCount}
            />
          </div>
          <div className="xl:col-span-1">
            <RecentInvoicesCard
              invoices={invoices}
              getClientName={getClientName}
            />
          </div>
          <div className="xl:col-span-1">
            <QuickActions />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-500/5 to-falah-accent/5 p-5 dark:border-gray-800 dark:from-brand-500/10 dark:to-falah-accent/10"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GridIcon className="h-4 w-4 text-brand-500" />
                <span>
                  {t("dashboard.packSummary", {
                    packs: packs.length,
                    templates: templates.length,
                  })}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
