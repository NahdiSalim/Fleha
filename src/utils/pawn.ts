import type { PawnPackLine } from "../types/pawn";
import type { SellLineItem } from "../types/templates";
import { computeLinePackDeposit } from "./sellCalculations";

export function generatePawnCode(existingCodes: string[]): string {
  const numbers = existingCodes
    .map((code) => parseInt(code.replace(/\D/g, ""), 10))
    .filter((value) => !Number.isNaN(value));

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `RH-${String(next).padStart(4, "0")}`;
}

export function buildPawnLinesFromSellLines(lines: SellLineItem[]): PawnPackLine[] {
  return lines
    .filter((line) => line.packPrice > 0 && line.quantity > 0)
    .map((line) => ({
      productName: line.productName,
      packName: line.packName,
      quantity: line.quantity,
      packPrice: line.packPrice,
      linePackTotal: computeLinePackDeposit(line.quantity, line.packPrice),
    }));
}
