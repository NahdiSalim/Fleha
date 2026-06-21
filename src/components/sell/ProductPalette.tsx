import { motion } from "framer-motion";
import type { ProductSummary } from "../../types/inventory";
import { t } from "../../i18n";
import {
  getPackBorderClass,
  getProductDisplayLabel,
  getProductEmoji,
} from "../../utils/sellCalculations";
import PackBadge from "./PackBadge";

interface ProductPaletteProps {
  products: ProductSummary[];
  onProductClick: (product: ProductSummary) => void;
}

export default function ProductPalette({
  products,
  onProductClick,
}: ProductPaletteProps) {
  const handleDragStart = (e: React.DragEvent, product: ProductSummary) => {
    e.dataTransfer.setData("productId", product.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  if (products.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("sell.noProductsInPalette")}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            type="button"
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            onClick={() => onProductClick(product)}
            title={getProductDisplayLabel(product)}
            className={`group flex w-[84px] flex-col items-center gap-1 rounded-xl border border-gray-100 border-t-[3px] bg-white p-2 pt-1.5 shadow-sm transition hover:border-brand-300 hover:shadow-md cursor-grab active:cursor-grabbing ${getPackBorderClass(product.packName)}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-falah-accent/10 text-base">
              {getProductEmoji(product.name)}
            </span>
            <span className="line-clamp-2 w-full text-center text-[9px] font-medium leading-tight text-gray-700 group-hover:text-brand-600">
              {product.name}
            </span>
            <PackBadge packName={product.packName} size="xs" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
