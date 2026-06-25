import Modal from "../ui/modal/Modal";
import { t } from "../../i18n";
import type { SupplyReceipt } from "../../types/inventory";

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: SupplyReceipt[];
  onPrint: () => void;
}

export default function PrintReceiptModal({
  isOpen,
  onClose,
  receipts,
  onPrint,
}: PrintReceiptModalProps) {
  if (receipts.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("tasalom.printLabels")}
      size="sm"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white dark:text-gray-300"
          >
            {t("common.close")}
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {t("common.print")}
          </button>
        </div>
      }
    >
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {t("tasalom.printReady", { count: receipts.length })}
      </p>
    </Modal>
  );
}
