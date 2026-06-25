import type { InvoiceProduct, UnitType } from "../types/clients";
import type { Pack, Product } from "../types/inventory";
import type { SellLineItem, TemplateLine } from "../types/templates";

export function packNameToUnitType(packName: string): UnitType {
  const name = packName.toLowerCase();
  if (name === "lama") return "lama";
  if (name === "plateau") return "plateau";
  return "gajou";
}

export function computeLineWeights(input: {
  quantity: number;
  unitNetWeight: number;
  unitGrossWeight: number;
  packWeight: number;
}) {
  const lineNetWeight =
    Math.round(
      (input.quantity * input.unitNetWeight +
        input.quantity * input.packWeight) *
        100
    ) / 100;
  const lineGrossWeight =
    Math.round(
      (input.quantity * input.unitGrossWeight +
        input.quantity * input.packWeight) *
        100
    ) / 100;
  return { lineNetWeight, lineGrossWeight };
}

export function computeLineProductTotal(
  lineNetWeight: number,
  pricePerKg: number
) {
  return Math.round(lineNetWeight * pricePerKg * 100) / 100;
}

export function computeLinePackDeposit(quantity: number, packPrice: number) {
  return Math.round(quantity * packPrice * 100) / 100;
}

export function computeLineTotal(
  lineNetWeight: number,
  pricePerKg: number,
  _quantity: number,
  _packPrice: number
) {
  return computeLineProductTotal(lineNetWeight, pricePerKg);
}

export function computePackDepositTotal(lines: SellLineItem[]) {
  return (
    Math.round(
      lines.reduce(
        (sum, line) => sum + computeLinePackDeposit(line.quantity, line.packPrice),
        0
      ) * 100
    ) / 100
  );
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
    total: computeLineTotal(
      lineNetWeight,
      line.pricePerKg,
      line.quantity,
      line.packPrice
    ),
  };
}

export function applyPackToLine(
  line: Omit<SellLineItem, "lineNetWeight" | "lineGrossWeight" | "total">,
  pack: Pack | undefined
): Omit<SellLineItem, "lineNetWeight" | "lineGrossWeight" | "total"> {
  if (!pack) {
    return {
      ...line,
      packId: "",
      packName: "",
      unitType: "gajou",
      packWeight: 0,
      packPrice: 0,
    };
  }

  return {
    ...line,
    packId: pack.id,
    packName: pack.name,
    unitType: packNameToUnitType(pack.name),
    packWeight: pack.weight,
    packPrice: pack.price,
    unitNetWeight: line.unitNetWeight || pack.weight,
    unitGrossWeight: line.unitGrossWeight || pack.weight,
  };
}

export function createLineFromProduct(
  product: Product,
  supplier = ""
): SellLineItem {
  return recalculateLine({
    id: crypto.randomUUID(),
    productId: product.id,
    productName: product.name,
    packId: "",
    packName: "",
    unitType: "gajou",
    quantity: 1,
    unitNetWeight: 0,
    unitGrossWeight: 0,
    packWeight: 0,
    packPrice: 0,
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
    packCount: line.quantity,
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
    packId: line.packId,
    quantity: line.quantity,
    unitNetWeight: line.unitNetWeight,
    unitGrossWeight: line.unitGrossWeight,
    pricePerKg: line.pricePerKg,
    supplier: line.supplier,
  };
}

export function templateLineToSellLine(
  tpl: TemplateLine,
  product: Product,
  pack: Pack | undefined
): SellLineItem {
  const base: Omit<SellLineItem, "lineNetWeight" | "lineGrossWeight" | "total"> = {
    id: crypto.randomUUID(),
    productId: product.id,
    productName: product.name,
    packId: "",
    packName: "",
    unitType: "gajou",
    quantity: tpl.quantity,
    unitNetWeight: tpl.unitNetWeight,
    unitGrossWeight: tpl.unitGrossWeight,
    packWeight: 0,
    packPrice: 0,
    pricePerKg: tpl.pricePerKg || product.pricePerKg,
    supplier: tpl.supplier,
  };

  return recalculateLine(applyPackToLine(base, pack));
}

export function getProductEmoji(name: string): string {
  const n = name;

  if (n.includes("طماطم")) return "🍅";
  if (n.includes("فلفل")) return "🌶️";
  if (n.includes("خيار")) return "🥒";
  if (n.includes("باذنجان")) return "🍆";
  if (n.includes("كوسة") || n.includes("قرع") || n.includes("بروكلي") || n.includes("قرنبيط")) return "🥬";
  if (n.includes("بصل") || n.includes("ثوم") || n.includes("كراث")) return "🧅";
  if (n.includes("جزر") || n.includes("لفت") || n.includes("شمندر")) return "🥕";
  if (n.includes("بطاطا")) return "🥔";
  if (n.includes("خس") || n.includes("جرجير") || n.includes("سبانخ") || n.includes("ملفوف") || n.includes("كرنب") || n.includes("سلق") || n.includes("هندبة")) return "🥗";
  if (n.includes("بقدونس") || n.includes("كزبرة") || n.includes("شبت") || n.includes("نعناع")) return "🌿";
  if (n.includes("فطر")) return "🍄";
  if (n.includes("ذرة")) return "🌽";
  if (n.includes("بامية") || n.includes("فول") || n.includes("بازلاء") || n.includes("فاصوليا") || n.includes("لوبيا")) return "🫛";
  if (n.includes("تفاح") || n.includes("إجاص") || n.includes("كمثرى")) return "🍎";
  if (n.includes("مشمش") || n.includes("خوخ") || n.includes("نكتارين") || n.includes("دراق") || n.includes("برقوق")) return "🍑";
  if (n.includes("كرز")) return "🍒";
  if (n.includes("تمر") || n.includes("تين")) return "🫒";
  if (n.includes("عنب")) return "🍇";
  if (n.includes("بطيخ") || n.includes("شمام")) return "🍉";
  if (n.includes("برتقال") || n.includes("يوسفي") || n.includes("ليمون") || n.includes("جريب")) return "🍊";
  if (n.includes("موز")) return "🍌";
  if (n.includes("مانجو")) return "🥭";
  if (n.includes("أناناس")) return "🍍";
  if (n.includes("كيوي")) return "🥝";
  if (n.includes("فراولة") || n.includes("توت")) return "🍓";
  if (n.includes("رمان")) return "🍎";
  if (n.includes("أفوكادو")) return "🥑";
  if (n.includes("جوافة")) return "🍐";
  if (n.includes("سفرجل")) return "🍐";
  if (n.includes("تمر هندي")) return "🫚";
  if (n.includes("كاكا")) return "🍊";
  if (n.includes("جوز") || n.includes("لوز") || n.includes("فستق") || n.includes("كستناء")) return "🥜";
  if (n.includes("زبيب") || n.includes("مجفف")) return "🍇";

  return "🥬";
}

export function getProductDisplayLabel(product: { name: string }): string {
  return product.name;
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
