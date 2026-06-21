import type { Invoice, InvoiceProduct, InvoiceStatus } from "../types/clients";

export function computeProductTotal(netWeight: number, pricePerKg: number): number {
  return Math.round(netWeight * pricePerKg * 100) / 100;
}

export function computeInvoiceTotal(products: InvoiceProduct[]): number {
  return Math.round(products.reduce((sum, p) => sum + p.total, 0) * 100) / 100;
}

export function deriveInvoiceStatus(balanceDue: number): InvoiceStatus {
  return balanceDue <= 0 ? "paid" : "partially_paid";
}

export function updateInvoiceBalance(invoice: Invoice, balanceDue: number): Invoice {
  const safeBalance = Math.max(0, Math.min(balanceDue, invoice.total));
  const paid = Math.round((invoice.total - safeBalance) * 100) / 100;

  return {
    ...invoice,
    balanceDue: safeBalance,
    paid,
    status: deriveInvoiceStatus(safeBalance),
  };
}

export function generateInvoiceId(existingIds: string[]): string {
  const numbers = existingIds
    .map((id) => parseInt(id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `INV-${String(next).padStart(4, "0")}`;
}
