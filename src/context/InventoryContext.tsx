import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedPacks, seedProducts, seedSuppliers } from "../data/seedInventory";
import { inferProductCategory } from "../data/seedProducts";
import { t } from "../i18n";
import type {
  Pack,
  Product,
  ProductCategory,
  ProductSummary,
  SupplyReceipt,
  StockItemSummary,
  Supplier,
  SupplierSummary,
} from "../types/inventory";

const STORAGE_KEY = "falah-inventory-data-v6";
const LEGACY_STORAGE_KEY = "falah-inventory-data-v5";

interface StoredData {
  packs: Pack[];
  products: Product[];
  suppliers: Supplier[];
  supplyReceipts: SupplyReceipt[];
}

interface InventoryContextValue {
  packs: Pack[];
  products: ProductSummary[];
  suppliers: SupplierSummary[];
  supplyReceipts: SupplyReceipt[];
  getPack: (id: string) => Pack | undefined;
  getProduct: (id: string) => ProductSummary | undefined;
  getSupplier: (id: string) => SupplierSummary | undefined;
  getSupplierStock: (supplierId: string) => StockItemSummary[];
  receiveSupply: (
    supplierId: string,
    productId: string,
    quantityKg: number
  ) => SupplyReceipt | null;
  receiveSupplies: (params: {
    supplierId?: string;
    newSupplier?: { name: string; phone?: string };
    lines: { productId: string; quantityKg: number }[];
  }) => SupplyReceipt[];
  addPack: (name: string, weight: number, price: number) => Pack;
  updatePack: (id: string, name: string, weight: number, price: number) => void;
  deletePack: (id: string) => void;
  addProduct: (
    name: string,
    pricePerKg: number,
    category: ProductCategory
  ) => Product;
  updateProduct: (
    id: string,
    name: string,
    pricePerKg: number,
    category: ProductCategory
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

function normalizeProduct(product: Product & { category?: ProductCategory }): Product {
  return {
    ...product,
    category: product.category ?? inferProductCategory(product.name),
  };
}

function normalizeData(data: StoredData): StoredData {
  return {
    ...data,
    products: data.products.map(normalizeProduct),
    supplyReceipts: (data.supplyReceipts ?? []).map((receipt) => ({
      ...receipt,
      batchId: receipt.batchId ?? receipt.id,
    })),
  };
}

function loadStoredData(): StoredData {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const data = normalizeData(JSON.parse(raw) as StoredData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
      return data;
    }
  } catch {
    // fall through
  }

  localStorage.removeItem("falah-inventory-data-v3");
  localStorage.removeItem("falah-inventory-data-v2");

  const data = {
    packs: seedPacks,
    products: seedProducts,
    suppliers: seedSuppliers,
    supplyReceipts: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
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
      [...data.products].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [data.products]
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

  const supplyReceipts = useMemo(
    () =>
      [...data.supplyReceipts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [data.supplyReceipts]
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
          const product = data.products.find((p) => p.id === item.productId);
          return {
            ...item,
            productName: product?.name ?? t("common.unknown"),
            pricePerKg: product?.pricePerKg ?? 0,
          };
        })
        .sort((a, b) => a.productName.localeCompare(b.productName));
    },
    [data.suppliers, data.products]
  );

  const receiveSupplies = useCallback(
    (params: {
      supplierId?: string;
      newSupplier?: { name: string; phone?: string };
      lines: { productId: string; quantityKg: number }[];
    }) => {
      const { lines } = params;
      if (lines.length === 0) return [];

      let supplier: Supplier | undefined;
      let suppliers = data.suppliers;

      if (params.supplierId) {
        supplier = data.suppliers.find((s) => s.id === params.supplierId);
      } else if (params.newSupplier?.name.trim()) {
        const created: Supplier = {
          id: crypto.randomUUID(),
          name: params.newSupplier.name.trim(),
          phone: params.newSupplier.phone?.trim() || "-",
          stock: [],
          createdAt: new Date().toISOString(),
        };
        supplier = created;
        suppliers = [created, ...data.suppliers];
      }

      if (!supplier) return [];

      const supplierId = supplier.id;
      const stockByProduct = new Map(
        supplier.stock.map((item) => [item.productId, { ...item }])
      );
      const receipts: SupplyReceipt[] = [];
      const batchId = crypto.randomUUID();
      const now = new Date().toISOString();

      for (const line of lines) {
        const product = data.products.find((p) => p.id === line.productId);
        if (!product || line.quantityKg <= 0) continue;

        const qty = Math.round(line.quantityKg * 100) / 100;
        const existing = stockByProduct.get(line.productId);
        if (existing) {
          existing.quantityKg = Math.round((existing.quantityKg + qty) * 100) / 100;
        } else {
          stockByProduct.set(line.productId, {
            id: crypto.randomUUID(),
            productId: line.productId,
            quantityKg: qty,
          });
        }

        receipts.push({
          id: crypto.randomUUID(),
          batchId,
          supplierId,
          supplierName: supplier.name,
          productId: line.productId,
          productName: product.name,
          quantityKg: qty,
          createdAt: now,
          source: "manual",
        });
      }

      if (receipts.length === 0) return [];

      persist({
        ...data,
        suppliers: suppliers.map((s) =>
          s.id === supplierId
            ? { ...s, stock: Array.from(stockByProduct.values()) }
            : s
        ),
        supplyReceipts: [...receipts, ...data.supplyReceipts],
      });

      return receipts;
    },
    [data, persist]
  );

  const receiveSupply = useCallback(
    (supplierId: string, productId: string, quantityKg: number) => {
      const receipts = receiveSupplies({
        supplierId,
        lines: [{ productId, quantityKg }],
      });
      return receipts[0] ?? null;
    },
    [receiveSupplies]
  );

  const addPack = useCallback(
    (name: string, weight: number, price: number) => {
      const pack: Pack = {
        id: crypto.randomUUID(),
        name: name.trim(),
        weight,
        price,
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, packs: [pack, ...data.packs] });
      return pack;
    },
    [data, persist]
  );

  const updatePack = useCallback(
    (id: string, name: string, weight: number, price: number) => {
      persist({
        ...data,
        packs: data.packs.map((p) =>
          p.id === id ? { ...p, name: name.trim(), weight, price } : p
        ),
      });
    },
    [data, persist]
  );

  const deletePack = useCallback(
    (id: string) => {
      persist({ ...data, packs: data.packs.filter((p) => p.id !== id) });
    },
    [data, persist]
  );

  const addProduct = useCallback(
    (name: string, pricePerKg: number, category: ProductCategory) => {
      const product: Product = {
        id: crypto.randomUUID(),
        name: name.trim(),
        category,
        pricePerKg,
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, products: [product, ...data.products] });
      return product;
    },
    [data, persist]
  );

  const updateProduct = useCallback(
    (id: string, name: string, pricePerKg: number, category: ProductCategory) => {
      persist({
        ...data,
        products: data.products.map((p) =>
          p.id === id ? { ...p, name: name.trim(), pricePerKg, category } : p
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
      supplyReceipts,
      getPack,
      getProduct,
      getSupplier,
      getSupplierStock,
      receiveSupply,
      receiveSupplies,
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
      supplyReceipts,
      getPack,
      getProduct,
      getSupplier,
      getSupplierStock,
      receiveSupply,
      receiveSupplies,
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
