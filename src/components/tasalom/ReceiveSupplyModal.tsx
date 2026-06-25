import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../ui/modal/Modal";
import SearchableSelect from "../ui/SearchableSelect";
import { t } from "../../i18n";
import { PlusIcon, TrashBinIcon } from "../../icons";
import type { ProductSummary, SupplierSummary } from "../../types/inventory";

interface SupplyLineDraft {
  id: string;
  productId: string;
  quantityKg: string;
}

type SupplierMode = "existing" | "new";

interface ReceiveSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: SupplierSummary[];
  products: ProductSummary[];
  onSubmit: (params: {
    supplierId?: string;
    newSupplier?: { name: string; phone?: string };
    lines: { productId: string; quantityKg: number }[];
  }) => void;
}

function createEmptyLine(products: ProductSummary[]): SupplyLineDraft {
  return {
    id: crypto.randomUUID(),
    productId: products[0]?.id ?? "",
    quantityKg: "",
  };
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export default function ReceiveSupplyModal({
  isOpen,
  onClose,
  suppliers,
  products,
  onSubmit,
}: ReceiveSupplyModalProps) {
  const [supplierMode, setSupplierMode] = useState<SupplierMode>("existing");
  const [supplierId, setSupplierId] = useState("");
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierPhone, setNewSupplierPhone] = useState("");
  const [lines, setLines] = useState<SupplyLineDraft[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setSupplierMode(suppliers.length > 0 ? "existing" : "new");
      setSupplierId(suppliers[0]?.id ?? "");
      setNewSupplierName("");
      setNewSupplierPhone("");
      setLines([createEmptyLine(products)]);
      setErrors({});
    }
  }, [isOpen, suppliers, products]);

  const supplierOptions = useMemo(
    () => suppliers.map((s) => ({ value: s.id, label: s.name })),
    [suppliers]
  );

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: p.name })),
    [products]
  );

  const updateLine = (id: string, patch: Partial<SupplyLineDraft>) => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...patch } : line)));
    setErrors({});
  };

  const addLine = () => {
    setLines((prev) => [...prev, createEmptyLine(products)]);
  };

  const removeLine = (id: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((line) => line.id !== id)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (supplierMode === "existing") {
      if (!supplierId) nextErrors.supplier = t("tasalom.selectSupplierRequired");
    } else if (!newSupplierName.trim()) {
      nextErrors.newSupplierName = t("suppliers.nameRequired");
    }

    const parsedLines: { productId: string; quantityKg: number }[] = [];
    let hasLineError = false;

    for (const line of lines) {
      const parsedQty = parseFloat(line.quantityKg);
      if (!line.productId) {
        hasLineError = true;
        continue;
      }
      if (Number.isNaN(parsedQty) || parsedQty <= 0) {
        hasLineError = true;
        continue;
      }
      parsedLines.push({ productId: line.productId, quantityKg: parsedQty });
    }

    if (parsedLines.length === 0) {
      nextErrors.lines = t("tasalom.atLeastOneLine");
    } else if (hasLineError) {
      nextErrors.lines = t("tasalom.linesInvalid");
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...(supplierMode === "existing"
        ? { supplierId }
        : {
            newSupplier: {
              name: newSupplierName.trim(),
              phone: newSupplierPhone.trim() || undefined,
            },
          }),
      lines: parsedLines,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("tasalom.addReceipt")}
      subtitle={t("tasalom.addReceiptSubtitle")}
      size="md"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white dark:text-gray-300"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="receive-supply-form"
            className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {t("common.confirm")}
          </button>
        </div>
      }
    >
      <form id="receive-supply-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("common.supplier")}
          </label>
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSupplierMode("existing");
                setErrors((prev) => ({ ...prev, supplier: "", newSupplierName: "" }));
              }}
              disabled={suppliers.length === 0}
              className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                supplierMode === "existing"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              } disabled:opacity-50`}
            >
              {t("tasalom.existingSupplier")}
            </button>
            <button
              type="button"
              onClick={() => {
                setSupplierMode("new");
                setErrors((prev) => ({ ...prev, supplier: "", newSupplierName: "" }));
              }}
              className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                supplierMode === "new"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {t("tasalom.newSupplier")}
            </button>
          </div>

          {supplierMode === "existing" ? (
            <>
              <SearchableSelect
                value={supplierId}
                onChange={(value) => {
                  setSupplierId(value);
                  setErrors((prev) => ({ ...prev, supplier: "" }));
                }}
                options={supplierOptions}
                placeholder={t("suppliers.selectSupplier")}
              />
              {errors.supplier && (
                <p className="mt-2 text-sm text-red-500">{errors.supplier}</p>
              )}
            </>
          ) : (
            <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("tasalom.newSupplierHint")}
              </p>
              <div>
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => {
                    setNewSupplierName(e.target.value);
                    setErrors((prev) => ({ ...prev, newSupplierName: "" }));
                  }}
                  placeholder={t("suppliers.namePlaceholder")}
                  className={inputClass}
                />
                {errors.newSupplierName && (
                  <p className="mt-2 text-sm text-red-500">{errors.newSupplierName}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  value={newSupplierPhone}
                  onChange={(e) => setNewSupplierPhone(e.target.value)}
                  placeholder={t("tasalom.phoneOptional")}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("tasalom.productsAndQuantities")}
            </label>
            <button
              type="button"
              onClick={addLine}
              disabled={products.length === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-brand-200 px-2.5 py-1.5 text-xs font-medium text-brand-600 transition hover:bg-brand-50 disabled:opacity-50"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              {t("tasalom.addProductLine")}
            </button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {lines.map((line, index) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: index * 0.02 }}
                  className="grid grid-cols-1 gap-2 rounded-xl border border-gray-100 bg-gray-50/80 p-3 sm:grid-cols-[1fr_120px_auto] dark:border-gray-800 dark:bg-gray-800/50"
                >
                  <SearchableSelect
                    value={line.productId}
                    onChange={(value) => updateLine(line.id, { productId: value })}
                    options={productOptions}
                    placeholder={t("suppliers.selectProduct")}
                    size="sm"
                    className="rounded-lg"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.quantityKg}
                    onChange={(e) => updateLine(line.id, { quantityKg: e.target.value })}
                    placeholder={t("suppliers.qtyKg")}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    disabled={lines.length <= 1}
                    className="flex h-9 w-9 items-center justify-center self-center rounded-lg text-red-400 transition hover:bg-red-50 disabled:opacity-30 sm:self-auto"
                    title={t("tasalom.removeLine")}
                  >
                    <TrashBinIcon className="action-icon" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {errors.lines && (
            <p className="mt-2 text-sm text-red-500">{errors.lines}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}
