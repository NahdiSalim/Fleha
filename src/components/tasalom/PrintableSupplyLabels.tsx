import { t } from "../../i18n";
import type { SupplyReceipt } from "../../types/inventory";

interface PrintableSupplyLabelsProps {
  receipts: SupplyReceipt[];
}

export default function PrintableSupplyLabels({ receipts }: PrintableSupplyLabelsProps) {
  if (receipts.length === 0) return null;

  return (
    <div className="print-supply-labels-root hidden print:block" dir="rtl">
      {receipts.map((receipt) => (
        <article
          key={receipt.id}
          className="print-supply-label mx-auto flex min-h-[50mm] w-[80mm] flex-col items-center justify-center border border-black/20 bg-white p-[6mm] text-center text-black"
        >
          <p className="text-[10px] uppercase tracking-wider text-black/60">
            {t("app.name")}
          </p>
          <p className="mt-4 text-xs text-black/60">{t("common.supplier")}</p>
          <p className="mt-1 text-xl font-bold">{receipt.supplierName}</p>
          <p className="mt-5 text-xs text-black/60">{t("common.product")}</p>
          <p className="mt-1 text-xl font-bold">{receipt.productName}</p>
        </article>
      ))}
    </div>
  );
}
