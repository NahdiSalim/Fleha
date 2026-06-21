import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EditBalanceModal from "../../components/clients/EditBalanceModal";
import InvoiceDetailsModal from "../../components/clients/InvoiceDetailsModal";
import InvoicesTable from "../../components/clients/InvoicesTable";
import PrintableInvoice from "../../components/clients/PrintableInvoice";
import StatCard from "../../components/clients/StatCard";
import { useClients } from "../../context/ClientsContext";
import { t } from "../../i18n";
import {
  ChevronLeftIcon,
  DollarLineIcon,
  DocsIcon,
} from "../../icons";
import { formatCurrency } from "../../utils/format";
import type { Invoice } from "../../types/clients";

export default function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getClient,
    getClientInvoices,
    updateInvoiceBalanceDue,
    deleteInvoice,
  } = useClients();

  const client = id ? getClient(id) : undefined;
  const invoices = id ? getClientInvoices(id) : [];

  const [detailsInvoice, setDetailsInvoice] = useState<Invoice | null>(null);
  const [editBalanceInvoice, setEditBalanceInvoice] = useState<Invoice | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  if (!client) {
    return (
      <AnimatedPage className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("clients.notFound")}</p>
        <Link
          to="/clients"
          className="mt-4 text-sm font-medium text-brand-500 hover:underline"
        >
          {t("clients.backToClients")}
        </Link>
      </AnimatedPage>
    );
  }

  const handlePrint = (invoice: Invoice) => {
    setPrintInvoice(invoice);
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setPrintInvoice(null);
      }, 150);
    });
  };

  const invoiceCountLabel =
    invoices.length === 1
      ? t("clients.invoicesOnRecord", { count: invoices.length })
      : t("clients.invoicesOnRecordPlural", { count: invoices.length });

  return (
    <>
      <PageMeta
        title={`${client.name} | ${t("meta.clientDetails")}`}
        description={invoiceCountLabel}
      />
      <AnimatedPage>
        {/* Back + header */}
        <div className="mb-6">
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/clients")}
            className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-600"
          >
            <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
            {t("clients.backToClients")}
          </motion.button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-lg shadow-brand-500/30"
              >
                {client.name.charAt(0).toUpperCase()}
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                  {client.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {invoiceCountLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label={t("common.totalInvoiced")}
            value={formatCurrency(client.totalInvoiced)}
            icon={<DocsIcon className="h-5 w-5" />}
            accent="primary"
            delay={0}
          />
          <StatCard
            label={t("common.totalPaid")}
            value={formatCurrency(client.totalPaid)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.05}
          />
          <StatCard
            label={t("common.balanceDue")}
            value={formatCurrency(client.balanceDue)}
            icon={<DollarLineIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.1}
          />
        </div>

        {/* Invoices section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("common.invoices")}</h2>
          <InvoicesTable
            invoices={invoices}
            onViewDetails={setDetailsInvoice}
            onEditBalance={setEditBalanceInvoice}
            onPrint={handlePrint}
            onDelete={setDeleteTarget}
          />
        </motion.div>
      </AnimatedPage>

      <InvoiceDetailsModal
        isOpen={!!detailsInvoice}
        onClose={() => setDetailsInvoice(null)}
        invoice={detailsInvoice}
        client={client}
      />

      <EditBalanceModal
        isOpen={!!editBalanceInvoice}
        onClose={() => setEditBalanceInvoice(null)}
        invoice={editBalanceInvoice}
        onSave={(balanceDue) =>
          editBalanceInvoice &&
          updateInvoiceBalanceDue(editBalanceInvoice.id, balanceDue)
        }
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteInvoice(deleteTarget.id)}
        title={t("clients.deleteInvoice")}
        message={t("clients.deleteInvoiceMessage", { id: deleteTarget?.invoiceId ?? "" })}
        confirmLabel={t("common.delete")}
      />

      {printInvoice && (
        <PrintableInvoice invoice={printInvoice} client={client} />
      )}
    </>
  );
}
