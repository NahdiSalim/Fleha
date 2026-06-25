export type ProductCategory = "vegetable" | "fruit";
export type SupplyReceiptSource = "manual";

export interface Pack {
  id: string;
  name: string;
  weight: number;
  price: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  pricePerKg: number;
  createdAt: string;
}

export type ProductSummary = Product;

export interface SupplierStockItem {
  id: string;
  productId: string;
  quantityKg: number;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  stock: SupplierStockItem[];
  createdAt: string;
}

export interface SupplierSummary extends Supplier {
  productCount: number;
  totalStockKg: number;
}

export interface StockItemSummary extends SupplierStockItem {
  productName: string;
  pricePerKg: number;
}

export interface SupplyReceipt {
  id: string;
  batchId: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  quantityKg: number;
  createdAt: string;
  source: SupplyReceiptSource;
}

export interface SupplyBatch {
  id: string;
  supplierId: string;
  supplierName: string;
  createdAt: string;
  source: SupplyReceiptSource;
  lines: SupplyReceipt[];
  totalQuantityKg: number;
  productCount: number;
}
