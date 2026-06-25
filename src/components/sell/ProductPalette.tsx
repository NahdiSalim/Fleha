import { motion } from "framer-motion";
import type { ProductSummary } from "../../types/inventory";
import { t } from "../../i18n";
import {
  getProductDisplayLabel,
  getProductEmoji,
} from "../../utils/sellCalculations";
import { getProductImageUrl } from "../../utils/productImages";

interface ProductPaletteProps {
  vegetables: ProductSummary[];
  fruits: ProductSummary[];
  onProductClick: (product: ProductSummary) => void;
}

function ProductGrid({
  products,
  onProductClick,
  accentClass,
}: {
  products: ProductSummary[];
  onProductClick: (product: ProductSummary) => void;
  accentClass: string;
}) {
  const handleDragStart = (e: React.DragEvent, product: ProductSummary) => {
    e.dataTransfer.setData("productId", product.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  if (products.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500">
        {t("products.noProductsYet")}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {products.map((product, index) => {
        const imageUrl = getProductImageUrl(product.name);

        return (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            type="button"
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            onClick={() => onProductClick(product)}
            title={getProductDisplayLabel(product)}
            className={`group flex w-[84px] flex-col items-center gap-1 rounded-xl border border-gray-100 border-t-[3px] bg-white p-2 pt-1.5 shadow-sm transition hover:border-brand-300 hover:shadow-md cursor-grab active:cursor-grabbing ${accentClass}`}
          >
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-50 to-falah-accent/10 text-base">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                getProductEmoji(product.name)
              )}
            </span>
            <span className="line-clamp-2 w-full text-center text-[9px] font-medium leading-tight text-gray-700 group-hover:text-brand-600">
              {product.name}
            </span>
          </button>
        </motion.div>
        );
      })}
    </div>
  );
}

export default function ProductPalette({
  vegetables,
  fruits,
  onProductClick,
}: ProductPaletteProps) {
  if (vegetables.length === 0 && fruits.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("sell.noProductsInPalette")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-0">
      <section className="min-w-0 lg:max-h-[420px] lg:overflow-y-auto lg:pe-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          {t("products.vegetables")} ({vegetables.length})
        </h3>
        <ProductGrid
          products={vegetables}
          onProductClick={onProductClick}
          accentClass="border-t-emerald-500"
        />
      </section>
      <section className="min-w-0 border-t border-gray-200 pt-4 lg:max-h-[420px] lg:overflow-y-auto lg:border-s lg:border-t-0 lg:pt-0 lg:ps-5 dark:border-gray-700">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-falah-accent dark:text-falah-accent-light">
          {t("products.fruits")} ({fruits.length})
        </h3>
        <ProductGrid
          products={fruits}
          onProductClick={onProductClick}
          accentClass="border-t-falah-accent"
        />
      </section>
    </div>
  );
}
