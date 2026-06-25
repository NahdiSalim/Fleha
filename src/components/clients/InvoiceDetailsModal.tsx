import { motion } from "framer-motion";
import Modal from "../ui/modal/Modal";
import StatusBadge from "./StatusBadge";
import { t } from "../../i18n";
import {
  capitalizeUnit,
  formatCurrency,
  formatDate,
  formatWeight,
} from "../../utils/format";
import type { ClientSummary, Invoice } from "../../types/clients";

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  client: ClientSummary | undefined;
}

export default function InvoiceDetailsModal({
  isOpen,
  onClose,
  invoice,
  client,
}: InvoiceDetailsModalProps) {
  if (!invoice) return null;

  const summaryItems = [
    { label: t("common.total"), value: formatCurrency(invoice.total), color: "brand" as const },
    { label: t("common.paid"), value: formatCurrency(invoice.paid), color: "emerald" as const },
    {
      label: t("common.balanceDue"),
      value: formatCurrency(invoice.balanceDue),
      color: "accent" as const,
    },
    { label: t("common.status"), value: null, status: invoice.status },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("clients.invoiceNumber", { id: invoice.invoiceId })}
      subtitle={`${client?.name ?? t("common.unknownClient")} · ${formatDate(invoice.date)}`}
      size="xl"
    >
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-gray-100 bg-gray-50/80 p-4"
          >
            <p className="text-xs text-gray-500 dark:text-gray-300">{item.label}</p>
            {"status" in item && item.status ? (
              <div className="mt-2">
                <StatusBadge status={item.status} />
              </div>
            ) : (
              <p
                className={`mt-1 text-lg font-bold ${
                  item.color === "brand"
                    ? "text-brand-600"
                    : item.color === "emerald"
                    ? "text-emerald-600"
                    : "text-falah-accent"
                }`}
              >
                {item.value}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="falah-table min-w-[900px] text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-brand-500 to-brand-600 text-white">
                <th className="px-4 py-3 font-medium">{t("sellTable.product")}</th>
                <th className="px-4 py-3 font-medium">{t("sellTable.unitType")}</th>
                <th className="px-4 py-3 font-medium">{t("sellTable.quantity")}</th>
                <th className="px-4 py-3 font-medium">{t("sellTable.grossWeight")}</th>
                <th className="px-4 py-3 font-medium">{t("sellTable.netWeight")}</th>
                <th className="px-4 py-3 font-medium">{t("sellTable.priceKg")}</th>
                <th className="px-4 py-3 font-medium">{t("common.total")}</th>
                <th className="px-4 py-3 font-medium">{t("sellTable.supplier")}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-gray-100 dark:border-gray-800 transition hover:bg-brand-50/40 dark:hover:bg-gray-800/60"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {product.productName}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-falah-accent/10 px-2 py-0.5 text-xs font-medium text-falah-accent">
                      {capitalizeUnit(product.unitType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-200">{product.quantity}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-200">
                    {formatWeight(product.grossWeight)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-200">
                    {formatWeight(product.netWeight)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-200">
                    {formatCurrency(product.pricePerKg)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-600 dark:text-brand-400">
                    {formatCurrency(product.total)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-300">{product.supplier}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td colSpan={7} className="px-4 py-3 text-end font-medium text-gray-600 dark:text-gray-200">
                  {t("common.subtotal")}
                </td>
                <td className="px-4 py-3 font-bold text-brand-600 dark:text-brand-400">
                  {formatCurrency(
                    invoice.products.reduce((s, p) => s + p.total, 0)
                  )}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Modal>
  );
}
