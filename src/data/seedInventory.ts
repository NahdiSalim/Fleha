import type { Pack, Product, Supplier } from "../types/inventory";
import { VEGETABLES, FRUITS } from "./seedProducts";

export const seedPacks: Pack[] = [
  { id: "pk1", name: "Gajou", weight: 25, price: 2.5, createdAt: "2025-10-01T00:00:00.000Z" },
  { id: "pk2", name: "Lama", weight: 30, price: 3.0, createdAt: "2025-10-01T00:00:00.000Z" },
  { id: "pk3", name: "Plateau", weight: 5, price: 1.0, createdAt: "2025-10-01T00:00:00.000Z" },
];

const SEED_DATE = "2025-10-05T00:00:00.000Z";

export const seedProducts: Product[] = [
  ...VEGETABLES.map((item, index) => ({
    id: `pr${index + 1}`,
    name: item.name,
    category: "vegetable" as const,
    pricePerKg: item.pricePerKg,
    createdAt: SEED_DATE,
  })),
  ...FRUITS.map((item, index) => ({
    id: `pr${VEGETABLES.length + index + 1}`,
    name: item.name,
    category: "fruit" as const,
    pricePerKg: item.pricePerKg,
    createdAt: SEED_DATE,
  })),
];

export const seedSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "AgriMaroc",
    phone: "+212 6 12 34 56 78",
    createdAt: "2025-10-10T00:00:00.000Z",
    stock: [
      { id: "st1", productId: "pr1", quantityKg: 450 },
      { id: "st2", productId: "pr3", quantityKg: 320 },
      { id: "st3", productId: "pr13", quantityKg: 280 },
      { id: "st4", productId: "pr11", quantityKg: 510 },
      { id: "st5", productId: "pr46", quantityKg: 200 },
    ],
  },
  {
    id: "s2",
    name: "FreshValley",
    phone: "+212 6 98 76 54 32",
    createdAt: "2025-10-12T00:00:00.000Z",
    stock: [
      { id: "st6", productId: "pr4", quantityKg: 180 },
      { id: "st7", productId: "pr14", quantityKg: 220 },
      { id: "st8", productId: "pr12", quantityKg: 390 },
      { id: "st9", productId: "pr56", quantityKg: 150 },
      { id: "st10", productId: "pr60", quantityKg: 95 },
    ],
  },
  {
    id: "s3",
    name: "GreenFields",
    phone: "+212 5 22 11 00 99",
    createdAt: "2025-10-15T00:00:00.000Z",
    stock: [
      { id: "st11", productId: "pr6", quantityKg: 600 },
      { id: "st12", productId: "pr10", quantityKg: 800 },
      { id: "st13", productId: "pr55", quantityKg: 350 },
      { id: "st14", productId: "pr65", quantityKg: 120 },
      { id: "st15", productId: "pr70", quantityKg: 240 },
    ],
  },
];
