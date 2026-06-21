import type { InvoiceProduct, UnitType } from "../types/clients";
import type { ProductSummary } from "../types/inventory";
import type { SellLineItem, TemplateLine } from "../types/templates";

export function packNameToUnitType(packName: string): UnitType {
  const name = packName.toLowerCase();
  if (name === "lama") return "lama";
  if (name === "plateau") return "plateau";
  return "gajou";
}

export function computeLineWeights(input: {
  quantity: number;
  packCount: number;
  unitNetWeight: number;
  unitGrossWeight: number;
  packWeight: number;
}) {
  const lineNetWeight =
    Math.round(
      (input.quantity * input.unitNetWeight + input.packCount * input.packWeight) *
        100
    ) / 100;
  const lineGrossWeight =
    Math.round(
      (input.quantity * input.unitGrossWeight +
        input.packCount * input.packWeight) *
        100
    ) / 100;
  return { lineNetWeight, lineGrossWeight };
}

export function computeLineTotal(lineNetWeight: number, pricePerKg: number) {
  return Math.round(lineNetWeight * pricePerKg * 100) / 100;
}

export function recalculateLine(
  line: Omit<
    SellLineItem,
    "lineNetWeight" | "lineGrossWeight" | "total"
  >
): SellLineItem {
  const { lineNetWeight, lineGrossWeight } = computeLineWeights(line);
  return {
    ...line,
    lineNetWeight,
    lineGrossWeight,
    total: computeLineTotal(lineNetWeight, line.pricePerKg),
  };
}

export function createLineFromProduct(
  product: ProductSummary,
  supplier = ""
): SellLineItem {
  return recalculateLine({
    id: crypto.randomUUID(),
    productId: product.id,
    productName: product.name,
    unitType: packNameToUnitType(product.packName),
    quantity: 1,
    packCount: 1,
    unitNetWeight: product.packWeight,
    unitGrossWeight: product.packWeight,
    packWeight: product.packWeight,
    pricePerKg: product.pricePerKg,
    supplier,
  });
}

export function lineToInvoiceProduct(line: SellLineItem): InvoiceProduct {
  return {
    id: line.id,
    productName: line.productName,
    unitType: line.unitType,
    quantity: line.quantity,
    packCount: line.packCount,
    grossWeight: line.lineGrossWeight,
    netWeight: line.lineNetWeight,
    pricePerKg: line.pricePerKg,
    total: line.total,
    supplier: line.supplier,
  };
}

export function lineToTemplateLine(line: SellLineItem): TemplateLine {
  return {
    productId: line.productId,
    quantity: line.quantity,
    packCount: line.packCount,
    unitNetWeight: line.unitNetWeight,
    unitGrossWeight: line.unitGrossWeight,
    pricePerKg: line.pricePerKg,
    supplier: line.supplier,
  };
}

export function templateLineToSellLine(
  tpl: TemplateLine,
  product: ProductSummary
): SellLineItem {
  return recalculateLine({
    id: crypto.randomUUID(),
    productId: product.id,
    productName: product.name,
    unitType: packNameToUnitType(product.packName),
    quantity: tpl.quantity,
    packCount: tpl.packCount,
    unitNetWeight: tpl.unitNetWeight,
    unitGrossWeight: tpl.unitGrossWeight,
    packWeight: product.packWeight,
    pricePerKg: tpl.pricePerKg || product.pricePerKg,
    supplier: tpl.supplier,
  });
}

export function getProductEmoji(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("tomate")) return "🍅";
  if (n.includes("poivron")) return "🌶️";
  if (n.includes("concombre")) return "🥒";
  if (n.includes("aubergine")) return "🍆";
  if (n.includes("courgette")) return "🥬";
  if (n.includes("oignon")) return "🧅";
  if (n.includes("carotte")) return "🥕";
  if (n.includes("pomme de terre") || n.includes("pomme")) return "🍎";
  if (n.includes("salade") || n.includes("épinard")) return "🥗";
  if (n.includes("citron") || n.includes("orange")) return "🍊";
  if (n.includes("banane")) return "🍌";
  if (n.includes("ail")) return "🧄";
  return "📦";
}

export function getProductDisplayLabel(product: {
  name: string;
  packName: string;
  packWeight?: number;
}): string {
  const weight =
    product.packWeight != null ? ` · ${product.packWeight} kg` : "";
  return `${product.name} — ${product.packName}${weight}`;
}

export function getPackBadgeClass(packName: string): string {
  const n = packName.toLowerCase();
  if (n === "gajou") return "bg-brand-500 text-white";
  if (n === "lama") return "bg-emerald-600 text-white";
  if (n === "plateau") return "bg-falah-accent text-white";
  return "bg-gray-600 text-white";
}

export function getPackBorderClass(packName: string): string {
  const n = packName.toLowerCase();
  if (n === "gajou") return "border-t-brand-500";
  if (n === "lama") return "border-t-emerald-500";
  if (n === "plateau") return "border-t-falah-accent";
  return "border-t-gray-400";
}
