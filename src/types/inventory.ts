export interface Pack {
  id: string;
  name: string;
  weight: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  packId: string;
  pricePerKg: number;
  createdAt: string;
}

export interface ProductSummary extends Product {
  packName: string;
  packWeight: number;
}

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
  packName: string;
  pricePerKg: number;
}
