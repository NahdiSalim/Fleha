import { t } from "../../i18n";
import type { InvoiceStatus } from "../../types/clients";

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isPaid = status === "paid";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isPaid
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30"
          : "bg-amber-50 text-falah-accent ring-1 ring-amber-200 dark:bg-falah-accent/15 dark:text-falah-accent-light dark:ring-falah-accent/30"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPaid ? "bg-emerald-500" : "bg-falah-accent animate-pulse"
        }`}
      />
      {isPaid ? t("common.paid") : t("common.partiallyPaid")}
    </span>
  );
}
