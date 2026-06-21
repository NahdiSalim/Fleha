export type UnitType = "gajou" | "lama" | "plateau";

export type InvoiceStatus = "paid" | "partially_paid";

export interface InvoiceProduct {
  id: string;
  productName: string;
  unitType: UnitType;
  quantity: number;
  packCount: number;
  grossWeight: number;
  netWeight: number;
  pricePerKg: number;
  total: number;
  supplier: string;
}

export interface Invoice {
  id: string;
  invoiceId: string;
  clientId: string;
  date: string;
  products: InvoiceProduct[];
  total: number;
  paid: number;
  balanceDue: number;
  status: InvoiceStatus;
}

export interface Client {
  id: string;
  name: string;
  createdAt: string;
}

export interface ClientSummary extends Client {
  totalInvoiced: number;
  totalPaid: number;
  balanceDue: number;
  invoiceCount: number;
}
