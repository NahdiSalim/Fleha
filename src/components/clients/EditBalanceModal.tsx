import { useEffect, useState } from "react";
import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import { formatCurrency } from "../../utils/format";
import type { Invoice } from "../../types/clients";

interface EditBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSave: (balanceDue: number) => void;
}

export default function EditBalanceModal({
  isOpen,
  onClose,
  invoice,
  onSave,
}: EditBalanceModalProps) {
  const [balanceDue, setBalanceDue] = useState("");

  useEffect(() => {
    if (invoice && isOpen) {
      setBalanceDue(String(invoice.balanceDue));
    }
  }, [invoice, isOpen]);

  if (!invoice) return null;

  const parsed = parseFloat(balanceDue);
  const isValid = !Number.isNaN(parsed) && parsed >= 0 && parsed <= invoice.total;
  const newPaid = isValid ? invoice.total - parsed : invoice.paid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSave(parsed);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("clients.editBalance")}
      subtitle={t("clients.invoiceNumber", { id: invoice.invoiceId })}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-white"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="balance-form"
            disabled={!isValid}
            className="flex-1 rounded-xl bg-falah-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-falah-accent-dark disabled:opacity-50"
          >
            {t("clients.updateBalance")}
          </button>
        </div>
      }
    >
      <form id="balance-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">{t("common.invoiceTotal")}</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(invoice.total)}
            </p>
          </div>
          <div className="rounded-xl bg-brand-50 p-4">
            <p className="text-xs text-brand-600">{t("clients.currentPaid")}</p>
            <p className="mt-1 text-lg font-semibold text-brand-700">
              {formatCurrency(invoice.paid)}
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="balance-due"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("common.balanceDue")}
          </label>
          <input
            id="balance-due"
            type="number"
            step="0.01"
            min="0"
            max={invoice.total}
            value={balanceDue}
            onChange={(e) => setBalanceDue(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
          {!isValid && balanceDue !== "" && (
            <p className="mt-2 text-sm text-red-500">
              {t("clients.balanceRange", { max: formatCurrency(invoice.total) })}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 p-4">
          <p className="text-xs text-gray-500">{t("clients.previewAfterUpdate")}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t("clients.newPaidAmount")}</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(isValid ? newPaid : invoice.paid)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t("common.status")}</span>
            <span
              className={`text-sm font-semibold ${
                isValid && parsed === 0 ? "text-emerald-600" : "text-falah-accent"
              }`}
            >
              {isValid && parsed === 0 ? t("common.paid") : t("common.partiallyPaid")}
            </span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
