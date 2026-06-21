import { useMemo } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import StatCard from "../../components/clients/StatCard";
import PaymentOverview from "../../components/dashboard/PaymentOverview";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentInvoicesCard from "../../components/dashboard/RecentInvoicesCard";
import { useClients } from "../../context/ClientsContext";
import { useInventory } from "../../context/InventoryContext";
import { useTemplates } from "../../context/TemplatesContext";
import {
  BoxCubeIcon,
  BoxIcon,
  DollarLineIcon,
  DocsIcon,
  GridIcon,
  GroupIcon,
  UserCircleIcon,
} from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatWeight } from "../../utils/format";

export default function Home() {
  const { clients, invoices, getClient } = useClients();
  const { products, suppliers, packs } = useInventory();
  const { templates } = useTemplates();

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
        description={t("app.description")}
      />
      <AnimatedPage>
        <div className="mb-6">
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

        {/* Finance */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t("dashboard.finance")}
        </p>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("common.totalInvoiced")}
            value={formatCurrency(stats.totalInvoiced)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="primary"
            delay={0}
          />
          <StatCard
            label={t("common.totalCollected")}
            value={formatCurrency(stats.totalPaid)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.05}
          />
          <StatCard
            label={t("common.outstandingBalance")}
            value={formatCurrency(stats.balanceDue)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.1}
          />
          <StatCard
            label={t("common.invoices")}
            value={String(invoices.length)}
            icon={<DocsIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.15}
          />
        </div>

        {/* Business */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t("dashboard.business")}
        </p>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("nav.clients")}
            value={String(clients.length)}
            icon={<GroupIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.1}
          />
          <StatCard
            label={t("nav.products")}
            value={String(products.length)}
            icon={<BoxCubeIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.15}
          />
          <StatCard
            label={t("nav.suppliers")}
            value={String(suppliers.length)}
            icon={<UserCircleIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.2}
          />
          <StatCard
            label={t("common.totalStock")}
            value={formatWeight(stats.totalStock)}
            icon={<BoxIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.25}
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
