import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AddStockModal from "../../components/suppliers/AddStockModal";
import AdjustStockModal from "../../components/suppliers/AdjustStockModal";
import StockTable from "../../components/suppliers/StockTable";
import StatCard from "../../components/clients/StatCard";
import { useInventory } from "../../context/InventoryContext";
import { t } from "../../i18n";
import { ChevronLeftIcon, GroupIcon, PlusIcon } from "../../icons";
import { formatWeight } from "../../utils/format";
import type { StockItemSummary } from "../../types/inventory";

export default function SupplierDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getSupplier,
    getSupplierStock,
    products,
    addStockItem,
    setStockQuantity,
    removeStockItem,
  } = useInventory();

  const supplier = id ? getSupplier(id) : undefined;
  const stock = id ? getSupplierStock(id) : [];

  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [setQtyTarget, setSetQtyTarget] = useState<StockItemSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockItemSummary | null>(null);

  if (!supplier) {
    return (
      <AnimatedPage className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{t("suppliers.notFound")}</p>
        <Link to="/suppliers" className="mt-4 text-sm font-medium text-brand-500 hover:underline">{t("suppliers.backToSuppliers")}</Link>
      </AnimatedPage>
    );
  }

  const existingProductIds = stock.map((s) => s.productId);

  return (
    <>
      <PageMeta title={`${supplier.name} | ${t("meta.suppliers")}`} description={t("suppliers.stockMeta", { name: supplier.name })} />
      <AnimatedPage>
        <div className="mb-6">
          <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate("/suppliers")} className="mb-4 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-600">
            <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" /> {t("suppliers.backToSuppliers")}
          </motion.button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-lg shadow-brand-500/30">
                {supplier.name.charAt(0).toUpperCase()}
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{supplier.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{supplier.phone}</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsAddStockOpen(true)} disabled={products.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 disabled:opacity-50">
              <PlusIcon className="h-4 w-4" /> {t("suppliers.addToStock")}
            </motion.button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label={t("suppliers.productsInStock")} value={String(supplier.productCount)} icon={<GroupIcon className="h-5 w-5" />} accent="primary" delay={0} />
          <StatCard label={t("common.totalStock")} value={formatWeight(supplier.totalStockKg)} icon={<GroupIcon className="h-5 w-5" />} accent="accent" delay={0.05} />
          <StatCard label={t("suppliers.availableProducts")} value={String(products.length - existingProductIds.length)} icon={<GroupIcon className="h-5 w-5" />} accent="primary" delay={0.1} />
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{t("common.stock")}</h2>
          <StockTable
            stock={stock}
            onAddStock={() => setIsAddStockOpen(true)}
            onSet={setSetQtyTarget}
            onDelete={setDeleteTarget}
          />
        </motion.div>
      </AnimatedPage>

      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onSubmit={(productId, qty) => addStockItem(supplier.id, productId, qty)}
        products={products}
        existingProductIds={existingProductIds}
      />

      <AdjustStockModal
        isOpen={!!setQtyTarget}
        onClose={() => setSetQtyTarget(null)}
        item={setQtyTarget}
        onConfirm={(quantityKg) => {
          if (setQtyTarget && id) {
            setStockQuantity(id, setQtyTarget.id, quantityKg);
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && id && removeStockItem(id, deleteTarget.id)}
        title={t("suppliers.deleteStockTitle")}
        message={t("suppliers.deleteStockMessage", { name: deleteTarget?.productName ?? "" })}
        confirmLabel={t("common.remove")}
      />
    </>
  );
}
