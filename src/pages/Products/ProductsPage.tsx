import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ProductFormModal from "../../components/products/ProductFormModal";
import ProductsTable from "../../components/products/ProductsTable";
import StatCard from "../../components/clients/StatCard";
import { useInventory } from "../../context/InventoryContext";
import { t } from "../../i18n";
import { BoxCubeIcon, DollarLineIcon, PlusIcon } from "../../icons";
import { formatCurrency } from "../../utils/format";
import type { ProductSummary } from "../../types/inventory";

export default function ProductsPage() {
  const { products, packs, addProduct, updateProduct, deleteProduct } = useInventory();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductSummary | null>(null);

  const avgPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return products.reduce((s, p) => s + p.pricePerKg, 0) / products.length;
  }, [products]);

  return (
    <>
      <PageMeta title={t("meta.products")} description={t("products.subtitle")} />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1 initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{t("products.title")}</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("products.subtitle")}
            </motion.p>
          </div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsAddOpen(true)} disabled={packs.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 disabled:opacity-50">
            <PlusIcon className="h-4 w-4" /> {t("products.addProduct")}
          </motion.button>
        </div>

        {packs.length === 0 && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {t("products.needPackFirst")}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label={t("products.totalProducts")} value={String(products.length)} icon={<BoxCubeIcon className="h-5 w-5" />} accent="primary" delay={0} />
          <StatCard label={t("products.avgPrice")} value={formatCurrency(avgPrice)} icon={<DollarLineIcon className="h-5 w-5" />} accent="accent" delay={0.05} />
          <StatCard label={t("common.packTypes")} value={String(packs.length)} icon={<BoxCubeIcon className="h-5 w-5" />} accent="primary" delay={0.1} />
        </div>

        <ProductsTable products={products} onEdit={setEditProduct} onDelete={setDeleteTarget} />
      </AnimatedPage>

      <ProductFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={(name, packId, price) => addProduct(name, packId, price)} packs={packs} mode="add" />
      <ProductFormModal isOpen={!!editProduct} onClose={() => setEditProduct(null)} onSubmit={(name, packId, price) => editProduct && updateProduct(editProduct.id, name, packId, price)} packs={packs} initialName={editProduct?.name} initialPackId={editProduct?.packId} initialPrice={editProduct?.pricePerKg} mode="edit" />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteProduct(deleteTarget.id)} title={t("products.deleteTitle")} message={t("products.deleteMessageWithStock", { name: deleteTarget?.name ?? "" })} confirmLabel={t("common.delete")} />
    </>
  );
}
