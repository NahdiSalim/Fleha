import { useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ClientFormModal from "../../components/clients/ClientFormModal";
import ClientsTable from "../../components/clients/ClientsTable";
import StatCard from "../../components/clients/StatCard";
import { useClients } from "../../context/ClientsContext";
import { DollarLineIcon, GroupIcon, PlusIcon } from "../../icons";
import { t } from "../../i18n";
import { formatCurrency } from "../../utils/format";
import type { ClientSummary } from "../../types/clients";

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editClient, setEditClient] = useState<ClientSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClientSummary | null>(null);

  const totals = clients.reduce(
    (acc, c) => ({
      invoiced: acc.invoiced + c.totalInvoiced,
      paid: acc.paid + c.totalPaid,
      due: acc.due + c.balanceDue,
    }),
    { invoiced: 0, paid: 0, due: 0 }
  );

  return (
    <>
      <PageMeta title={t("meta.clients")} description={t("clients.subtitle")} />
      <AnimatedPage>
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl"
            >
              {t("clients.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {t("clients.subtitle")}
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:shadow-brand-500/40"
          >
            <PlusIcon className="h-4 w-4" />
            {t("clients.addClient")}
          </motion.button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("common.totalClients")}
            value={String(clients.length)}
            icon={<GroupIcon className="h-5 w-5" />}
            accent="primary"
            delay={0}
          />
          <StatCard
            label={t("common.totalInvoiced")}
            value={formatCurrency(totals.invoiced)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.05}
          />
          <StatCard
            label={t("common.totalPaid")}
            value={formatCurrency(totals.paid)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.1}
          />
          <StatCard
            label={t("common.totalBalanceDue")}
            value={formatCurrency(totals.due)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.15}
          />
        </div>

        {/* Table */}
        <ClientsTable
          clients={clients}
          onEdit={setEditClient}
          onDelete={setDeleteTarget}
        />
      </AnimatedPage>

      <ClientFormModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={addClient}
        mode="add"
      />

      <ClientFormModal
        isOpen={!!editClient}
        onClose={() => setEditClient(null)}
        onSubmit={(name) => editClient && updateClient(editClient.id, name)}
        initialName={editClient?.name ?? ""}
        mode="edit"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteClient(deleteTarget.id)}
        title={t("clients.deleteTitle")}
        message={t("clients.deleteMessage", { name: deleteTarget?.name ?? "" })}
        confirmLabel={t("common.delete")}
      />
    </>
  );
}
