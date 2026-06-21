import type { Pack, Product, Supplier } from "../types/inventory";

export const seedPacks: Pack[] = [
  { id: "pk1", name: "Gajou", weight: 25, createdAt: "2025-10-01T00:00:00.000Z" },
  { id: "pk2", name: "Lama", weight: 30, createdAt: "2025-10-01T00:00:00.000Z" },
  { id: "pk3", name: "Plateau", weight: 5, createdAt: "2025-10-01T00:00:00.000Z" },
];

export const seedProducts: Product[] = [
  { id: "pr1", name: "Tomates Cerises", packId: "pk3", pricePerKg: 18.5, createdAt: "2025-10-05T00:00:00.000Z" },
  { id: "pr8", name: "Tomates Cerises", packId: "pk1", pricePerKg: 16.0, createdAt: "2025-10-06T00:00:00.000Z" },
  { id: "pr2", name: "Poivrons Rouges", packId: "pk1", pricePerKg: 22.0, createdAt: "2025-10-05T00:00:00.000Z" },
  { id: "pr3", name: "Concombres", packId: "pk2", pricePerKg: 12.0, createdAt: "2025-10-05T00:00:00.000Z" },
  { id: "pr4", name: "Aubergines", packId: "pk1", pricePerKg: 16.5, createdAt: "2025-10-05T00:00:00.000Z" },
  { id: "pr5", name: "Courgettes", packId: "pk3", pricePerKg: 14.0, createdAt: "2025-10-05T00:00:00.000Z" },
  { id: "pr6", name: "Oignons Jaunes", packId: "pk2", pricePerKg: 8.5, createdAt: "2025-10-05T00:00:00.000Z" },
  { id: "pr7", name: "Carottes", packId: "pk1", pricePerKg: 7.5, createdAt: "2025-10-05T00:00:00.000Z" },
];

export const seedSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "AgriMaroc",
    phone: "+212 6 12 34 56 78",
    createdAt: "2025-10-10T00:00:00.000Z",
    stock: [
      { id: "st1", productId: "pr1", quantityKg: 450 },
      { id: "st11", productId: "pr8", quantityKg: 320 },
      { id: "st2", productId: "pr2", quantityKg: 320 },
      { id: "st3", productId: "pr4", quantityKg: 280 },
      { id: "st4", productId: "pr7", quantityKg: 510 },
    ],
  },
  {
    id: "s2",
    name: "FreshValley",
    phone: "+212 6 98 76 54 32",
    createdAt: "2025-10-12T00:00:00.000Z",
    stock: [
      { id: "st5", productId: "pr2", quantityKg: 180 },
      { id: "st6", productId: "pr5", quantityKg: 220 },
      { id: "st7", productId: "pr3", quantityKg: 390 },
    ],
  },
  {
    id: "s3",
    name: "GreenFields",
    phone: "+212 5 22 11 00 99",
    createdAt: "2025-10-15T00:00:00.000Z",
    stock: [
      { id: "st8", productId: "pr3", quantityKg: 560 },
      { id: "st9", productId: "pr6", quantityKg: 740 },
      { id: "st10", productId: "pr5", quantityKg: 150 },
    ],
  },
];
