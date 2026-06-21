import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import PrintableInvoice from "../../components/clients/PrintableInvoice";
import InvoiceLinesTable from "../../components/sell/InvoiceLinesTable";
import ProductPalette from "../../components/sell/ProductPalette";
import SaveTemplateModal from "../../components/sell/SaveTemplateModal";
import { useClients } from "../../context/ClientsContext";
import { useInventory } from "../../context/InventoryContext";
import { useTemplates } from "../../context/TemplatesContext";
import { t } from "../../i18n";
import { DocsIcon, CheckCircleIcon, PlusIcon } from "../../icons";
import { formatCurrency } from "../../utils/format";
import type { Invoice } from "../../types/clients";
import type { SellLineItem } from "../../types/templates";
import {
  createLineFromProduct,
  lineToInvoiceProduct,
  lineToTemplateLine,
  templateLineToSellLine,
} from "../../utils/sellCalculations";

export default function SellPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clients, getClient, createInvoice } = useClients();
  const { products, suppliers } = useInventory();
  const { templates, getTemplate, saveTemplate } = useTemplates();

  const [clientId, setClientId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [lines, setLines] = useState<SellLineItem[]>([]);
  const [paymentType, setPaymentType] = useState<"paid" | "partial">("paid");
  const [paidAmount, setPaidAmount] = useState("");
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const invoiceTotal = useMemo(
    () => Math.round(lines.reduce((s, l) => s + l.total, 0) * 100) / 100,
    [lines]
  );

  const computedPaid = useMemo(() => {
    if (paymentType === "paid") return invoiceTotal;
    const parsed = parseFloat(paidAmount);
    if (Number.isNaN(parsed)) return 0;
    return Math.min(Math.max(0, parsed), invoiceTotal);
  }, [paymentType, paidAmount, invoiceTotal]);

  const balanceDue = Math.round((invoiceTotal - computedPaid) * 100) / 100;

  const suppliersForProduct = useCallback(
    (productId: string) =>
      suppliers
        .filter((s) => s.stock.some((st) => st.productId === productId))
        .map((s) => s.name),
    [suppliers]
  );

  const addProductLine = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const supplierList = suppliersForProduct(productId);
      setLines((prev) => [
        ...prev,
        createLineFromProduct(product, supplierList[0] ?? ""),
      ]);
    },
    [products, suppliersForProduct]
  );

  const loadTemplate = useCallback(
    (id: string) => {
      const template = getTemplate(id);
      if (!template) return;
      const loaded = template.lines
        .map((tpl) => {
          const product = products.find((p) => p.id === tpl.productId);
          if (!product) return null;
          return templateLineToSellLine(tpl, product);
        })
        .filter(Boolean) as SellLineItem[];
      setLines(loaded);
      setTemplateId(id);
    },
    [getTemplate, products]
  );

  useEffect(() => {
    const tplParam = searchParams.get("template");
    if (tplParam && products.length > 0) {
      loadTemplate(tplParam);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, products.length, loadTemplate, setSearchParams]);

  const handleSaveInvoice = () => {
    if (!clientId) {
      alert(t("sell.selectClientAlert"));
      return;
    }
    if (lines.length === 0) {
      alert(t("sell.addLineAlert"));
      return;
    }
    const invoice = createInvoice({
      clientId,
      products: lines.map(lineToInvoiceProduct),
      paid: computedPaid,
    });
    setSuccessMsg(t("sell.savedSuccess", { id: invoice.invoiceId }));
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handlePrint = () => {
    if (!clientId) {
      alert(t("sell.selectClientAlert"));
      return;
    }
    if (lines.length === 0) {
      alert(t("sell.addLineAlert"));
      return;
    }
    const client = getClient(clientId);
    if (!client) return;

    const preview: Invoice = {
      id: "preview",
      invoiceId: "PREVIEW",
      clientId,
      date: new Date().toISOString(),
      products: lines.map(lineToInvoiceProduct),
      total: invoiceTotal,
      paid: computedPaid,
      balanceDue,
      status: balanceDue <= 0 ? "paid" : "partially_paid",
    };
    setPrintInvoice(preview);
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setPrintInvoice(null);
      }, 150);
    });
  };

  const selectedClient = clientId ? getClient(clientId) : undefined;

  return (
    <>
      <PageMeta title={t("meta.sell")} description={t("sell.subtitle")} />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <motion.h1 initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              {t("sell.title")}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("sell.subtitle")}
            </motion.p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIsSaveTemplateOpen(true)} disabled={lines.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-falah-accent/30 bg-falah-accent/5 px-4 py-2.5 text-sm font-medium text-falah-accent transition hover:bg-falah-accent/10 disabled:opacity-50">
              <PlusIcon className="h-4 w-4" /> {t("sell.saveAsTemplate")}
            </button>
            <button type="button" onClick={handlePrint} disabled={!clientId || lines.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
              <DocsIcon className="action-icon" /> {t("common.print")}
            </button>
            <button type="button" onClick={handleSaveInvoice} disabled={!clientId || lines.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:shadow-brand-500/40 disabled:opacity-50">
              <CheckCircleIcon className="h-4 w-4" /> {t("sell.saveInvoice")}
            </button>
          </div>
        </div>

        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMsg}
          </motion.div>
        )}

        {/* Client & Template */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label htmlFor="sell-client" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("sell.client")}
            </label>
            <select
              id="sell-client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            >
              <option value="">{t("common.selectClient")}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label htmlFor="sell-template" className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("sell.loadTemplate")}
            </label>
            <select
              id="sell-template"
              value={templateId}
              onChange={(e) => {
                const val = e.target.value;
                setTemplateId(val);
                if (val) loadTemplate(val);
                else setLines([]);
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            >
              <option value="">{t("common.noTemplate")}</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{t("sell.templateItems", { name: tpl.name, count: tpl.lines.length })}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product palette */}
        <div className="mb-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-brand-50/30 p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t("sell.quickAdd")}
          </p>
          <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
            <span className="font-medium">{t("sell.packColors")}</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-500" /> Gajou</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-600" /> Lama</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-falah-accent" /> Plateau</span>
          </div>
          <ProductPalette products={products} onProductClick={(p) => addProductLine(p.id)} />
        </div>

        {/* Lines table */}
        <div className="mb-6">
          <InvoiceLinesTable
            lines={lines}
            products={products}
            suppliersForProduct={suppliersForProduct}
            onChange={setLines}
            onDropProduct={addProductLine}
          />
        </div>

        {/* Payment & summary */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{t("sell.payment")}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentType("paid")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${paymentType === "paid" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t("common.paidInFull")}
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("partial")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${paymentType === "partial" ? "border-falah-accent bg-falah-accent/10 text-falah-accent" : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {t("common.partiallyPaid")}
              </button>
            </div>
            {paymentType === "partial" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                <label htmlFor="paid-amount" className="mb-2 block text-xs font-medium text-gray-600">
                  {t("common.amountPaid")}
                </label>
                <input
                  id="paid-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={invoiceTotal}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
                />
              </motion.div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-500/5 to-falah-accent/5 p-5 shadow-sm dark:border-gray-800 dark:from-brand-500/10 dark:to-falah-accent/10 dark:bg-gray-900">
            <p className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{t("sell.summary")}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t("common.lineItems")}</span>
                <span className="font-medium">{lines.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("common.invoiceTotal")}</span>
                <span className="text-lg font-bold text-brand-600">{formatCurrency(invoiceTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("common.paid")}</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(computedPaid)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t("common.balanceDue")}</span>
                <span className="font-bold text-falah-accent">{formatCurrency(balanceDue)}</span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>

      <SaveTemplateModal
        isOpen={isSaveTemplateOpen}
        onClose={() => setIsSaveTemplateOpen(false)}
        onSave={(name) => saveTemplate(name, lines.map(lineToTemplateLine))}
      />

      {printInvoice && selectedClient && (
        <PrintableInvoice invoice={printInvoice} client={selectedClient} />
      )}
    </>
  );
}
