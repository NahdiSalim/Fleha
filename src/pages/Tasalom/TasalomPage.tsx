import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageMeta from "../../components/common/PageMeta";
import AnimatedPage from "../../components/ui/AnimatedPage";
import StatCard from "../../components/clients/StatCard";
import PrintReceiptModal from "../../components/tasalom/PrintReceiptModal";
import PrintableSupplyLabels from "../../components/tasalom/PrintableSupplyLabels";
import ReceiveSupplyModal from "../../components/tasalom/ReceiveSupplyModal";
import SupplyReceiptsTable from "../../components/tasalom/SupplyReceiptsTable";
import { useInventory } from "../../context/InventoryContext";
import { t } from "../../i18n";
import { BoxCubeIcon, GroupIcon, PlusIcon, TimeIcon } from "../../icons";
import { formatWeight } from "../../utils/format";
import { filterSupplyBatches, groupSupplyReceipts } from "../../utils/supplyBatches";
import type { SupplyReceipt } from "../../types/inventory";

export default function TasalomPage() {
  const { suppliers, products, supplyReceipts, receiveSupplies } = useInventory();
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [receiptsToPrint, setReceiptsToPrint] = useState<SupplyReceipt[]>([]);

  const supplyBatches = useMemo(
    () => groupSupplyReceipts(supplyReceipts),
    [supplyReceipts]
  );

  const filteredBatches = useMemo(
    () => filterSupplyBatches(supplyBatches, supplierFilter, productFilter),
    [supplyBatches, supplierFilter, productFilter]
  );

  const totalReceivedKg = useMemo(
    () =>
      Math.round(
        filteredBatches.reduce((sum, batch) => sum + batch.totalQuantityKg, 0) * 100
      ) / 100,
    [filteredBatches]
  );

  const suppliersCount = useMemo(
    () => new Set(filteredBatches.map((batch) => batch.supplierId)).size,
    [filteredBatches]
  );

  const productsCount = useMemo(
    () =>
      new Set(
        filteredBatches.flatMap((batch) => batch.lines.map((line) => line.productId))
      ).size,
    [filteredBatches]
  );

  const handlePrint = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
      }, 150);
    });
  };

  return (
    <>
      <PageMeta title={t("meta.tasalom")} description={t("tasalom.subtitle")} />
      <AnimatedPage>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl"
            >
              {t("tasalom.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {t("tasalom.subtitle")}
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsReceiveOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25"
          >
            <PlusIcon className="h-4 w-4" /> {t("tasalom.addReceipt")}
          </motion.button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("tasalom.receiptsCount")}
            value={String(filteredBatches.length)}
            icon={<TimeIcon className="h-5 w-5" />}
            accent="primary"
            delay={0}
          />
          <StatCard
            label={t("tasalom.totalReceived")}
            value={formatWeight(totalReceivedKg)}
            icon={<BoxCubeIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.05}
          />
          <StatCard
            label={t("tasalom.suppliersInHistory")}
            value={String(suppliersCount)}
            icon={<GroupIcon className="h-5 w-5" />}
            accent="primary"
            delay={0.1}
          />
          <StatCard
            label={t("tasalom.productsInHistory")}
            value={String(productsCount)}
            icon={<BoxCubeIcon className="h-5 w-5" />}
            accent="accent"
            delay={0.15}
          />
        </div>

        <SupplyReceiptsTable
          batches={filteredBatches}
          supplierFilter={supplierFilter}
          productFilter={productFilter}
          suppliers={suppliers}
          products={products}
          onSupplierFilterChange={setSupplierFilter}
          onProductFilterChange={setProductFilter}
        />
      </AnimatedPage>

      <ReceiveSupplyModal
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        suppliers={suppliers}
        products={products}
        onSubmit={(params) => {
          const receipts = receiveSupplies(params);
          if (receipts.length > 0) {
            setReceiptsToPrint(receipts);
          }
        }}
      />

      <PrintReceiptModal
        isOpen={receiptsToPrint.length > 0}
        onClose={() => setReceiptsToPrint([])}
        receipts={receiptsToPrint}
        onPrint={handlePrint}
      />

      {receiptsToPrint.length > 0 && (
        <PrintableSupplyLabels receipts={receiptsToPrint} />
      )}
    </>
  );
}
