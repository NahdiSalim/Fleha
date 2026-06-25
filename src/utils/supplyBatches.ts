import type { SupplyBatch, SupplyReceipt } from "../types/inventory";

export function groupSupplyReceipts(receipts: SupplyReceipt[]): SupplyBatch[] {
  const batches = new Map<string, SupplyReceipt[]>();

  for (const receipt of receipts) {
    const batchId = receipt.batchId ?? receipt.id;
    const existing = batches.get(batchId);
    if (existing) {
      existing.push(receipt);
    } else {
      batches.set(batchId, [receipt]);
    }
  }

  return Array.from(batches.entries())
    .map(([id, lines]) => {
      const sortedLines = [...lines].sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
      const first = sortedLines[0];
      const totalQuantityKg =
        Math.round(
          sortedLines.reduce((sum, line) => sum + line.quantityKg, 0) * 100
        ) / 100;

      return {
        id,
        supplierId: first.supplierId,
        supplierName: first.supplierName,
        createdAt: first.createdAt,
        source: first.source,
        lines: sortedLines,
        totalQuantityKg,
        productCount: sortedLines.length,
      };
    })
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function filterSupplyBatches(
  batches: SupplyBatch[],
  supplierFilter: string,
  productFilter: string
): SupplyBatch[] {
  return batches.filter((batch) => {
    if (supplierFilter && batch.supplierId !== supplierFilter) return false;
    if (productFilter && !batch.lines.some((line) => line.productId === productFilter)) {
      return false;
    }
    return true;
  });
}
