import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedPacks, seedProducts, seedSuppliers } from "../data/seedInventory";
import { t } from "../i18n";
import type {
  Pack,
  Product,
  ProductSummary,
  StockItemSummary,
  Supplier,
  SupplierSummary,
} from "../types/inventory";

const STORAGE_KEY = "falah-inventory-data-v2";

interface StoredData {
  packs: Pack[];
  products: Product[];
  suppliers: Supplier[];
}

interface InventoryContextValue {
  packs: Pack[];
  products: ProductSummary[];
  suppliers: SupplierSummary[];
  getPack: (id: string) => Pack | undefined;
  getProduct: (id: string) => ProductSummary | undefined;
  getSupplier: (id: string) => SupplierSummary | undefined;
  getSupplierStock: (supplierId: string) => StockItemSummary[];
  getPackUsageCount: (packId: string) => number;
  addPack: (name: string, weight: number) => Pack;
  updatePack: (id: string, name: string, weight: number) => void;
  deletePack: (id: string) => boolean;
  addProduct: (name: string, packId: string, pricePerKg: number) => Product;
  updateProduct: (
    id: string,
    name: string,
    packId: string,
    pricePerKg: number
  ) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (name: string, phone: string) => Supplier;
  updateSupplier: (id: string, name: string, phone: string) => void;
  deleteSupplier: (id: string) => void;
  addStockItem: (
    supplierId: string,
    productId: string,
    quantityKg: number
  ) => boolean;
  adjustStock: (
    supplierId: string,
    stockItemId: string,
    deltaKg: number
  ) => void;
  setStockQuantity: (
    supplierId: string,
    stockItemId: string,
    quantityKg: number
  ) => void;
  removeStockItem: (supplierId: string, stockItemId: string) => void;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

function loadStoredData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredData;
  } catch {
    // fall through
  }
  return { packs: seedPacks, products: seedProducts, suppliers: seedSuppliers };
}

function summarizeProduct(product: Product, packs: Pack[]): ProductSummary {
  const pack = packs.find((p) => p.id === product.packId);
  return {
    ...product,
    packName: pack?.name ?? t("common.unknown"),
    packWeight: pack?.weight ?? 0,
  };
}

function summarizeSupplier(supplier: Supplier): SupplierSummary {
  return {
    ...supplier,
    productCount: supplier.stock.length,
    totalStockKg: supplier.stock.reduce((s, item) => s + item.quantityKg, 0),
  };
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadStoredData);

  const persist = useCallback((next: StoredData) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const packs = useMemo(
    () =>
      [...data.packs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [data.packs]
  );

  const products = useMemo(
    () =>
      data.products
        .map((p) => summarizeProduct(p, data.packs))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [data.products, data.packs]
  );

  const suppliers = useMemo(
    () =>
      data.suppliers
        .map(summarizeSupplier)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [data.suppliers]
  );

  const getPack = useCallback(
    (id: string) => packs.find((p) => p.id === id),
    [packs]
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getSupplier = useCallback(
    (id: string) => suppliers.find((s) => s.id === id),
    [suppliers]
  );

  const getSupplierStock = useCallback(
    (supplierId: string): StockItemSummary[] => {
      const supplier = data.suppliers.find((s) => s.id === supplierId);
      if (!supplier) return [];

      return supplier.stock
        .map((item) => {
          const product = summarizeProduct(
            data.products.find((p) => p.id === item.productId) ?? {
              id: item.productId,
              name: t("common.unknown"),
              packId: "",
              pricePerKg: 0,
              createdAt: "",
            },
            data.packs
          );
          return {
            ...item,
            productName: product.name,
            packName: product.packName,
            pricePerKg: product.pricePerKg,
          };
        })
        .sort((a, b) => a.productName.localeCompare(b.productName));
    },
    [data.suppliers, data.products, data.packs]
  );

  const getPackUsageCount = useCallback(
    (packId: string) => data.products.filter((p) => p.packId === packId).length,
    [data.products]
  );

  const addPack = useCallback(
    (name: string, weight: number) => {
      const pack: Pack = {
        id: crypto.randomUUID(),
        name: name.trim(),
        weight,
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, packs: [pack, ...data.packs] });
      return pack;
    },
    [data, persist]
  );

  const updatePack = useCallback(
    (id: string, name: string, weight: number) => {
      persist({
        ...data,
        packs: data.packs.map((p) =>
          p.id === id ? { ...p, name: name.trim(), weight } : p
        ),
      });
    },
    [data, persist]
  );

  const deletePack = useCallback(
    (id: string) => {
      if (data.products.some((p) => p.packId === id)) return false;
      persist({ ...data, packs: data.packs.filter((p) => p.id !== id) });
      return true;
    },
    [data, persist]
  );

  const addProduct = useCallback(
    (name: string, packId: string, pricePerKg: number) => {
      const product: Product = {
        id: crypto.randomUUID(),
        name: name.trim(),
        packId,
        pricePerKg,
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, products: [product, ...data.products] });
      return product;
    },
    [data, persist]
  );

  const updateProduct = useCallback(
    (id: string, name: string, packId: string, pricePerKg: number) => {
      persist({
        ...data,
        products: data.products.map((p) =>
          p.id === id
            ? { ...p, name: name.trim(), packId, pricePerKg }
            : p
        ),
      });
    },
    [data, persist]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persist({
        ...data,
        products: data.products.filter((p) => p.id !== id),
        suppliers: data.suppliers.map((s) => ({
          ...s,
          stock: s.stock.filter((item) => item.productId !== id),
        })),
      });
    },
    [data, persist]
  );

  const addSupplier = useCallback(
    (name: string, phone: string) => {
      const supplier: Supplier = {
        id: crypto.randomUUID(),
        name: name.trim(),
        phone: phone.trim(),
        stock: [],
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, suppliers: [supplier, ...data.suppliers] });
      return supplier;
    },
    [data, persist]
  );

  const updateSupplier = useCallback(
    (id: string, name: string, phone: string) => {
      persist({
        ...data,
        suppliers: data.suppliers.map((s) =>
          s.id === id ? { ...s, name: name.trim(), phone: phone.trim() } : s
        ),
      });
    },
    [data, persist]
  );

  const deleteSupplier = useCallback(
    (id: string) => {
      persist({
        ...data,
        suppliers: data.suppliers.filter((s) => s.id !== id),
      });
    },
    [data, persist]
  );

  const addStockItem = useCallback(
    (supplierId: string, productId: string, quantityKg: number) => {
      const supplier = data.suppliers.find((s) => s.id === supplierId);
      if (!supplier) return false;
      if (supplier.stock.some((item) => item.productId === productId)) {
        return false;
      }

      persist({
        ...data,
        suppliers: data.suppliers.map((s) =>
          s.id === supplierId
            ? {
                ...s,
                stock: [
                  ...s.stock,
                  {
                    id: crypto.randomUUID(),
                    productId,
                    quantityKg: Math.max(0, quantityKg),
                  },
                ],
              }
            : s
        ),
      });
      return true;
    },
    [data, persist]
  );

  const adjustStock = useCallback(
    (supplierId: string, stockItemId: string, deltaKg: number) => {
      persist({
        ...data,
        suppliers: data.suppliers.map((s) =>
          s.id === supplierId
            ? {
                ...s,
                stock: s.stock.map((item) =>
                  item.id === stockItemId
                    ? {
                        ...item,
                        quantityKg: Math.max(0, item.quantityKg + deltaKg),
                      }
                    : item
                ),
              }
            : s
        ),
      });
    },
    [data, persist]
  );

  const setStockQuantity = useCallback(
    (supplierId: string, stockItemId: string, quantityKg: number) => {
      persist({
        ...data,
        suppliers: data.suppliers.map((s) =>
          s.id === supplierId
            ? {
                ...s,
                stock: s.stock.map((item) =>
                  item.id === stockItemId
                    ? { ...item, quantityKg: Math.max(0, quantityKg) }
                    : item
                ),
              }
            : s
        ),
      });
    },
    [data, persist]
  );

  const removeStockItem = useCallback(
    (supplierId: string, stockItemId: string) => {
      persist({
        ...data,
        suppliers: data.suppliers.map((s) =>
          s.id === supplierId
            ? {
                ...s,
                stock: s.stock.filter((item) => item.id !== stockItemId),
              }
            : s
        ),
      });
    },
    [data, persist]
  );

  const value = useMemo(
    () => ({
      packs,
      products,
      suppliers,
      getPack,
      getProduct,
      getSupplier,
      getSupplierStock,
      getPackUsageCount,
      addPack,
      updatePack,
      deletePack,
      addProduct,
      updateProduct,
      deleteProduct,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addStockItem,
      adjustStock,
      setStockQuantity,
      removeStockItem,
    }),
    [
      packs,
      products,
      suppliers,
      getPack,
      getProduct,
      getSupplier,
      getSupplierStock,
      getPackUsageCount,
      addPack,
      updatePack,
      deletePack,
      addProduct,
      updateProduct,
      deleteProduct,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      addStockItem,
      adjustStock,
      setStockQuantity,
      removeStockItem,
    ]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return ctx;
}
