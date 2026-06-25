import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import StatCard from "../../components/clients/StatCard";
import SearchableSelect from "../../components/ui/SearchableSelect";
import AnimatedPage from "../../components/ui/AnimatedPage";
import Modal from "../../components/ui/modal/Modal";
import { useClients } from "../../context/ClientsContext";
import { useInventory } from "../../context/InventoryContext";
import { BoxCubeIcon, CheckCircleIcon, DocsIcon, GroupIcon, PencilIcon } from "../../icons";
import { t } from "../../i18n";
import { formatCurrency, formatDate, formatWeight } from "../../utils/format";

interface SoldProductRow {
  invoiceId: string;
  invoiceDbId: string;
  clientId: string;
  clientName: string;
  date: string;
  lineId: string;
  productName: string;
  supplier: string;
  quantity: number;
  netWeight: number;
  total: number;
}

function getDateInputValue(date: string): string {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Moutaba3tBay3ElBadha2i3Page() {
  const { invoices, getClient, updateInvoiceProductSupplier } = useClients();
  const { products, suppliers } = useInventory();

  const [dateFilter, setDateFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [editingRow, setEditingRow] = useState<SoldProductRow | null>(null);
  const [supplierDraft, setSupplierDraft] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const rows = useMemo<SoldProductRow[]>(
    () =>
      invoices.flatMap((invoice) => {
        const clientName = getClient(invoice.clientId)?.name ?? t("common.unknownClient");
        return invoice.products.map((product) => ({
          invoiceId: invoice.invoiceId,
          invoiceDbId: invoice.id,
          clientId: invoice.clientId,
          clientName,
          date: invoice.date,
          lineId: product.id,
          productName: product.productName,
          supplier: product.supplier,
          quantity: product.quantity,
          netWeight: product.netWeight,
          total: product.total,
        }));
      }),
    [invoices, getClient]
  );

  const productOptions = useMemo(() => {
    const names = Array.from(new Set(rows.map((row) => row.productName))).sort((a, b) =>
      a.localeCompare(b)
    );
    return names.map((name) => ({ value: name, label: name }));
  }, [rows]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (dateFilter && getDateInputValue(row.date) !== dateFilter) return false;
        if (productFilter && row.productName !== productFilter) return false;
        return true;
      }),
    [rows, dateFilter, productFilter]
  );

  const totalWeight = useMemo(
    () => Math.round(filteredRows.reduce((sum, row) => sum + row.netWeight, 0) * 100) / 100,
    [filteredRows]
  );

  const totalValue = useMemo(
    () => Math.round(filteredRows.reduce((sum, row) => sum + row.total, 0) * 100) / 100,
    [filteredRows]
  );

  const clientsCount = useMemo(
    () => new Set(filteredRows.map((row) => row.clientId)).size,
    [filteredRows]
  );

  const supplierOptions = useMemo(() => {
    if (!editingRow) return [];

    const matchedProduct = products.find((product) => product.name === editingRow.productName);
    const recommendedSuppliers = new Set(
      matchedProduct
        ? suppliers
            .filter((supplier) =>
              supplier.stock.some((stockItem) => stockItem.productId === matchedProduct.id)
            )
            .map((supplier) => supplier.name)
        : []
    );

    const allSupplierNames = new Set(suppliers.map((supplier) => supplier.name));
    if (editingRow.supplier) allSupplierNames.add(editingRow.supplier);

    return Array.from(allSupplierNames)
      .sort((a, b) => {
        const aRecommended = recommendedSuppliers.has(a) ? 0 : 1;
        const bRecommended = recommendedSuppliers.has(b) ? 0 : 1;
        if (aRecommended !== bRecommended) return aRecommended - bRecommended;
        return a.localeCompare(b);
      })
      .map((name) => ({
        value: name,
        label: name,
        searchText: recommendedSuppliers.has(name) ? "recommended" : "",
      }));
  }, [editingRow, products, suppliers]);

  const openEditModal = (row: SoldProductRow) => {
    setEditingRow(row);
    setSupplierDraft(row.supplier);
  };

  const closeEditModal = () => {
    setEditingRow(null);
    setSupplierDraft("");
  };

  const handleSaveSupplier = () => {
    if (!editingRow || !supplierDraft.trim()) return;

    updateInvoiceProductSupplier(
      editingRow.invoiceDbId,
      editingRow.lineId,
      supplierDraft.trim()
    );
    setSuccessMsg(
      t("sellFollowup.supplierUpdated", {
        invoiceId: editingRow.invoiceId,
        product: editingRow.productName,
      })
    );
    window.setTimeout(() => setSuccessMsg(""), 4000);
    closeEditModal();
  };

  return (
    <>
      <PageMeta
        title={t("meta.sellFollowup")}
        description={t("sellFollowup.subtitle")}
      />
      <AnimatedPage>
        <div className="mb-6">
          <motion.h1
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl"
          >
            {t("sellFollowup.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {t("sellFollowup.subtitle")}
          </motion.p>
        </div>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {successMsg}
          </motion.div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("sellFollowup.linesCount")}
            value={String(filteredRows.length)}
            icon={<DocsIcon className="h-5 w-5" />}
            accent="primary"
            delay={0}
          />
          <StatCard
            label={t("sellFollowup.totalWeight")}
            value={formatWeight(totalWeight)}
            icon={<BoxCubeIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.05}
          />
          <StatCard
            label={t("sellFollowup.totalValue")}
            value={formatCurrency(totalValue)}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.1}
          />
          <StatCard
            label={t("sellFollowup.clientsInResult")}
            value={String(clientsCount)}
            icon={<GroupIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.15}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("sellFollowup.filterByDay")}
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("sellFollowup.filterByProduct")}
            </label>
            <SearchableSelect
              value={productFilter}
              onChange={setProductFilter}
              options={productOptions}
              placeholder={t("sellFollowup.allProducts")}
              emptyOption={{ value: "", label: t("sellFollowup.allProducts") }}
            />
          </div>
        </div>

        {filteredRows.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {t("sellFollowup.noLines")}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("sellFollowup.noLinesHint")}
            </p>
          </motion.div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="hidden overflow-x-auto md:block">
              <table className="falah-table min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gradient-to-r from-brand-500/5 to-falah-accent/5 dark:border-gray-800 dark:from-brand-500/15 dark:to-falah-accent/15">
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.date")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.invoice")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("sell.client")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.product")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.supplier")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.quantity")}
                    </th>
                    <th className="px-6 py-4 font-semibold text-gray-700 dark:text-white">
                      {t("common.total")}
                    </th>
                    <th className="px-6 py-4 text-end font-semibold text-gray-700 dark:text-white">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, index) => (
                    <motion.tr
                      key={`${row.invoiceDbId}-${row.lineId}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-50 hover:bg-brand-50/30 dark:border-gray-800 dark:hover:bg-gray-800/60"
                    >
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-200">
                        {formatDate(row.date)}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm font-bold text-brand-700 dark:text-brand-300">
                        {row.invoiceId}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {row.clientName}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {row.productName}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {row.supplier || t("sellFollowup.noSupplier")}
                      </td>
                      <td className="px-6 py-4 text-brand-600">
                        {row.quantity.toLocaleString("ar-TN")}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(row.total)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                          >
                            <PencilIcon className="action-icon" />
                            <span>{t("sellFollowup.fixSupplier")}</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {filteredRows.map((row, index) => (
                <motion.div
                  key={`${row.invoiceDbId}-${row.lineId}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {row.productName}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {row.clientName} · {row.invoiceId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openEditModal(row)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600"
                    >
                      <PencilIcon className="action-icon" />
                      <span>{t("sellFollowup.fixSupplier")}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("common.date")}
                      </p>
                      <p className="mt-1 font-medium text-gray-900 dark:text-white">
                        {formatDate(row.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("common.supplier")}
                      </p>
                      <p className="mt-1 font-medium text-gray-900 dark:text-white">
                        {row.supplier || t("sellFollowup.noSupplier")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("common.quantity")}
                      </p>
                      <p className="mt-1 font-semibold text-brand-600">
                        {row.quantity.toLocaleString("ar-TN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("common.total")}
                      </p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(row.total)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatedPage>

      <Modal
        isOpen={!!editingRow}
        onClose={closeEditModal}
        title={t("sellFollowup.fixSupplier")}
        subtitle={
          editingRow
            ? t("sellFollowup.editSubtitle", {
                product: editingRow.productName,
                invoiceId: editingRow.invoiceId,
              })
            : undefined
        }
        size="md"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeEditModal}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white dark:text-gray-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSaveSupplier}
              disabled={!supplierDraft.trim()}
              className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              {t("common.saveChanges")}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-sm dark:border-gray-800 dark:bg-gray-800/50">
            <p className="font-medium text-gray-900 dark:text-white">
              {editingRow?.clientName}
            </p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {editingRow ? `${editingRow.invoiceId} · ${formatDate(editingRow.date)}` : ""}
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("common.supplier")}
            </label>
            <SearchableSelect
              value={supplierDraft}
              onChange={setSupplierDraft}
              options={supplierOptions}
              placeholder={t("suppliers.selectSupplier")}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
