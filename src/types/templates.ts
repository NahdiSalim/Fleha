import type { UnitType } from "./clients";

export interface TemplateLine {
  productId: string;
  packId: string;
  quantity: number;
  unitNetWeight: number;
  unitGrossWeight: number;
  pricePerKg: number;
  supplier: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  lines: TemplateLine[];
  createdAt: string;
}

export interface SellLineItem {
  id: string;
  productId: string;
  productName: string;
  packId: string;
  packName: string;
  unitType: UnitType;
  quantity: number;
  unitNetWeight: number;
  unitGrossWeight: number;
  packWeight: number;
  packPrice: number;
  pricePerKg: number;
  supplier: string;
  lineNetWeight: number;
  lineGrossWeight: number;
  total: number;
}
