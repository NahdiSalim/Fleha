import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StatCard from "../../components/clients/StatCard";
import { useTemplates } from "../../context/TemplatesContext";
import { useInventory } from "../../context/InventoryContext";
import { t } from "../../i18n";
import { DocsIcon, EyeIcon, TrashBinIcon } from "../../icons";
import PackBadge from "../../components/sell/PackBadge";

export default function TemplatesPage() {
  const { templates, deleteTemplate } = useTemplates();
  const { products } = useInventory();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteTarget = templates.find((tpl) => tpl.id === deleteId);

  return (
    <>
      <PageMeta title={t("meta.templates")} description={t("templates.subtitle")} />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1 initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              {t("templates.title")}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("templates.subtitle")}
            </motion.p>
          </div>
          <Link to="/sell" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25">
            {t("templates.goToSell")}
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label={t("templates.totalTemplates")} value={String(templates.length)} icon={<DocsIcon className="h-5 w-5" />} accent="primary" delay={0} />
          <StatCard label={t("templates.productsAvailable")} value={String(products.length)} icon={<DocsIcon className="h-5 w-5" />} accent="accent" delay={0.05} />
        </div>

        {templates.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-lg font-medium text-gray-900 dark:text-white">{t("templates.noTemplatesYet")}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("templates.noTemplatesHint")}</p>
            <Link to="/sell" className="mt-4 text-sm font-medium text-brand-500 hover:underline">
              {t("templates.createFirst")}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 transition hover:shadow-md"
              >
                <div className="bg-gradient-to-r from-brand-500/10 to-falah-accent/10 px-5 py-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {t("templates.lines", { count: template.lines.length })} ·{" "}
                    {new Date(template.createdAt).toLocaleDateString("ar-TN")}
                  </p>
                </div>
                <ul className="max-h-32 overflow-y-auto px-5 py-3 text-xs text-gray-600">
                  {template.lines.map((line, i) => {
                    const product = products.find((p) => p.id === line.productId);
                    return (
                      <li key={i} className="flex items-center justify-between gap-2 border-b border-gray-50 dark:border-gray-800 py-1 last:border-0">
                        <span>{product?.name ?? t("common.unknown")}</span>
                        {product && <PackBadge packName={product.packName} size="xs" />}
                        <span className="shrink-0 text-gray-400">{t("templates.qtyLabel", { qty: line.quantity })}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex gap-2 border-t border-gray-100 p-3">
                  <Link
                    to={`/sell?template=${template.id}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-2 text-xs font-medium text-white transition hover:bg-brand-600"
                  >
                    <EyeIcon className="action-icon" /><span>{t("templates.useTemplate")}</span>
                  </Link>
                  <button
                    onClick={() => setDeleteId(template.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <TrashBinIcon className="action-icon" /><span>{t("common.delete")}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatedPage>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteTemplate(deleteId)}
        title={t("templates.deleteTitle")}
        message={t("templates.deleteMessage", { name: deleteTarget?.name ?? "" })}
        confirmLabel={t("common.delete")}
      />
    </>
  );
}
