import { t } from "../../i18n";
import {
  capitalizeUnit,
  formatCurrencyPrint,
  formatDatePrint,
  formatWeightPrint,
} from "../../utils/format";
import type { ClientSummary, Invoice } from "../../types/clients";

interface PrintableInvoiceProps {
  invoice: Invoice;
  client: ClientSummary;
}

function PrintRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="print-row flex justify-between gap-2">
      <span className="text-black/70">{label}</span>
      <span className={`text-end ${bold ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function PrintDivider({ thick = false }: { thick?: boolean }) {
  return (
    <div
      className={`print-divider my-2 ${thick ? "border-t-2 border-black" : "border-t border-black/30"}`}
    />
  );
}

export default function PrintableInvoice({
  invoice,
  client,
}: PrintableInvoiceProps) {
  const productsSubtotal = invoice.products.reduce((s, p) => s + p.total, 0);
  const statusLabel =
    invoice.status === "paid" ? t("print.paidStatus") : t("print.partialStatus");

  return (
    <div className="print-invoice-root hidden print:block" dir="rtl">
      <article className="print-invoice-sheet mx-auto w-[80mm] bg-white p-[4mm] text-[9px] leading-snug text-black">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-[13px] font-bold uppercase tracking-[0.2em]">
            {t("app.name")}
          </h1>
          <p className="mt-0.5 text-[8px] uppercase tracking-widest text-black/60">
            {t("print.invoice")}
          </p>
        </header>

        <PrintDivider thick />

        {/* Invoice meta */}
        <section className="space-y-1">
          <PrintRow label={t("print.invoiceNo")} value={invoice.invoiceId} bold />
          <PrintRow label={t("print.date")} value={formatDatePrint(invoice.date)} />
          <PrintRow label={t("print.client")} value={client.name} />
        </section>

        <PrintDivider />

        {/* Products */}
        <section>
          <p className="mb-2 text-[8px] font-bold uppercase tracking-wider">
            {t("print.articles", { count: invoice.products.length })}
          </p>

          <div className="space-y-0">
            {invoice.products.map((product, index) => (
              <div
                key={product.id}
                className={`print-product py-2 ${index > 0 ? "border-t border-black/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold leading-tight">
                    {index + 1}. {product.productName}
                  </p>
                  <p className="shrink-0 font-bold">
                    {formatCurrencyPrint(product.total)}
                  </p>
                </div>

                <p className="mt-0.5 text-[8px] text-black/60">
                  {capitalizeUnit(product.unitType)} · {product.supplier}
                </p>

                <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[8px]">
                  <span>{t("print.qty")}: {product.quantity}</span>
                  <span>{t("print.gross")}: {formatWeightPrint(product.grossWeight)}</span>
                  <span>{t("print.net")}: {formatWeightPrint(product.netWeight)}</span>
                  <span className="col-span-2">
                    {t("print.price")}: {formatCurrencyPrint(product.pricePerKg)}/{t("common.kg")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PrintDivider thick />

        {/* Totals */}
        <section className="space-y-1 text-[9px]">
          <PrintRow
            label={t("print.subtotal")}
            value={formatCurrencyPrint(productsSubtotal)}
          />
          {(invoice.packDepositTotal ?? 0) > 0 && (
            <>
              <PrintRow
                label={t("pawn.packDeposit")}
                value={formatCurrencyPrint(invoice.packDepositTotal ?? 0)}
              />
              {invoice.pawnCode && (
                <PrintRow
                  label={t("pawn.code")}
                  value={invoice.pawnCode}
                  bold
                />
              )}
            </>
          )}
          <PrintRow label={t("print.total")} value={formatCurrencyPrint(invoice.total)} bold />
          <PrintRow label={t("print.paid")} value={formatCurrencyPrint(invoice.paid)} />
          <PrintRow
            label={t("print.balanceDue")}
            value={formatCurrencyPrint(invoice.balanceDue)}
            bold
          />
          <PrintRow label={t("print.status")} value={statusLabel} />
        </section>

        <PrintDivider />

        <footer className="pt-1 text-center text-[8px] text-black/50">
          {t("print.thankYou")}
        </footer>
      </article>
    </div>
  );
}
