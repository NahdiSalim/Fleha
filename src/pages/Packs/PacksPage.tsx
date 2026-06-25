import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PackFormModal from "../../components/packs/PackFormModal";
import PacksTable from "../../components/packs/PacksTable";
import StatCard from "../../components/clients/StatCard";
import { useInventory } from "../../context/InventoryContext";
import { t } from "../../i18n";
import { BoxIcon, DollarLineIcon, PlusIcon } from "../../icons";
import { formatCurrency, formatWeight } from "../../utils/format";
import type { Pack } from "../../types/inventory";

export default function PacksPage() {
  const { packs, addPack, updatePack, deletePack } = useInventory();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editPack, setEditPack] = useState<Pack | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pack | null>(null);

  const avgWeight = packs.length
    ? packs.reduce((s, p) => s + p.weight, 0) / packs.length
    : 0;

  const avgPrice = useMemo(() => {
    if (packs.length === 0) return 0;
    return packs.reduce((s, p) => s + p.price, 0) / packs.length;
  }, [packs]);

  return (
    <>
      <PageMeta title={t("meta.packs")} description={t("packs.subtitle")} />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1 initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{t("packs.title")}</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("packs.subtitle")}
            </motion.p>
          </div>
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsAddOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25">
            <PlusIcon className="h-4 w-4" /> {t("packs.addPack")}
          </motion.button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label={t("packs.totalPacks")} value={String(packs.length)} icon={<BoxIcon className="h-5 w-5" />} accent="primary" delay={0} />
          <StatCard label={t("packs.avgWeight")} value={formatWeight(avgWeight)} icon={<BoxIcon className="h-5 w-5" />} accent="accent" delay={0.05} />
          <StatCard label={t("packs.avgPrice")} value={formatCurrency(avgPrice)} icon={<DollarLineIcon className="h-5 w-5" />} accent="primary" delay={0.1} />
        </div>

        <PacksTable packs={packs} onEdit={setEditPack} onDelete={setDeleteTarget} />
      </AnimatedPage>

      <PackFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={(name, weight, price) => addPack(name, weight, price)} mode="add" />
      <PackFormModal isOpen={!!editPack} onClose={() => setEditPack(null)} onSubmit={(name, weight, price) => editPack && updatePack(editPack.id, name, weight, price)} initialName={editPack?.name} initialWeight={editPack?.weight} initialPrice={editPack?.price} mode="edit" />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && deletePack(deleteTarget.id)} title={t("packs.deleteTitle")} message={t("packs.deleteMessage", { name: deleteTarget?.name ?? "" })} confirmLabel={t("common.delete")} />
    </>
  );
}
