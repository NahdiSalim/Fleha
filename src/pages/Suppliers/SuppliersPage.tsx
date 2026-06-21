import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SupplierFormModal from "../../components/suppliers/SupplierFormModal";
import SuppliersTable from "../../components/suppliers/SuppliersTable";
import StatCard from "../../components/clients/StatCard";
import { useInventory } from "../../context/InventoryContext";
import { t } from "../../i18n";
import { GroupIcon, PlusIcon } from "../../icons";
import { formatWeight } from "../../utils/format";
import type { SupplierSummary } from "../../types/inventory";

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useInventory();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<SupplierSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SupplierSummary | null>(null);

  const totalStock = useMemo(
    () => suppliers.reduce((s, sup) => s + sup.totalStockKg, 0),
    [suppliers]
  );

  return (
    <>
      <PageMeta title={t("meta.suppliers")} description={t("suppliers.subtitle")} />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1 initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{t("suppliers.title")}</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("suppliers.subtitle")}
            </motion.p>
          </div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsAddOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25">
            <PlusIcon className="h-4 w-4" /> {t("suppliers.addSupplier")}
          </motion.button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label={t("common.totalSuppliers")} value={String(suppliers.length)} icon={<GroupIcon className="h-5 w-5" />} accent="primary" delay={0} />
          <StatCard label={t("common.totalStock")} value={formatWeight(totalStock)} icon={<GroupIcon className="h-5 w-5" />} accent="accent" delay={0.05} />
          <StatCard label={t("suppliers.stockEntries")} value={String(suppliers.reduce((s, sup) => s + sup.productCount, 0))} icon={<GroupIcon className="h-5 w-5" />} accent="primary" delay={0.1} />
        </div>

        <SuppliersTable suppliers={suppliers} onEdit={setEditSupplier} onDelete={setDeleteTarget} />
      </AnimatedPage>

      <SupplierFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={(name, phone) => addSupplier(name, phone)} mode="add" />
      <SupplierFormModal isOpen={!!editSupplier} onClose={() => setEditSupplier(null)} onSubmit={(name, phone) => editSupplier && updateSupplier(editSupplier.id, name, phone)} initialName={editSupplier?.name} initialPhone={editSupplier?.phone} mode="edit" />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && deleteSupplier(deleteTarget.id)} title={t("suppliers.deleteTitle")} message={t("suppliers.deleteMessage", { name: deleteTarget?.name ?? "" })} confirmLabel={t("common.delete")} />
    </>
  );
}
