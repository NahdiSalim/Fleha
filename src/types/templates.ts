import type { UnitType } from "./clients";

export interface TemplateLine {
  productId: string;
  quantity: number;
  packCount: number;
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
  unitType: UnitType;
  quantity: number;
  packCount: number;
  unitNetWeight: number;
  unitGrossWeight: number;
  packWeight: number;
  pricePerKg: number;
  supplier: string;
  lineNetWeight: number;
  lineGrossWeight: number;
  total: number;
}
