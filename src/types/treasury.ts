export type TreasuryTransactionType = "in" | "out";
export type TreasuryTransactionSource = "manual" | "invoice" | "pawn";

export interface TreasuryTransaction {
  id: string;
  type: TreasuryTransactionType;
  amount: number;
  user: string;
  beneficiary: string;
  note: string;
  source: TreasuryTransactionSource;
  createdAt: string;
}
