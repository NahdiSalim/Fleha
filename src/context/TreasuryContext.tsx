import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  TreasuryTransaction,
  TreasuryTransactionSource,
  TreasuryTransactionType,
} from "../types/treasury";

const STORAGE_KEY = "falah-treasury-data-v1";

interface TreasuryContextValue {
  transactions: TreasuryTransaction[];
  currentBalance: number;
  totalIn: number;
  totalOut: number;
  addTransaction: (params: {
    type: TreasuryTransactionType;
    amount: number;
    user: string;
    beneficiary: string;
    note: string;
    source?: TreasuryTransactionSource;
  }) => TreasuryTransaction;
  addInvoiceIncomeTransaction: (params: {
    amount: number;
    beneficiary: string;
    note: string;
    user?: string;
  }) => TreasuryTransaction | null;
}

const TreasuryContext = createContext<TreasuryContextValue | null>(null);

function loadTransactions(): TreasuryTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as TreasuryTransaction[];
    }
  } catch {
    // fall through
  }

  return [];
}

export function TreasuryProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>(
    loadTransactions
  );

  const persist = useCallback((next: TreasuryTransaction[]) => {
    setTransactions(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addTransaction = useCallback(
    (params: {
      type: TreasuryTransactionType;
      amount: number;
      user: string;
      beneficiary: string;
      note: string;
      source?: TreasuryTransactionSource;
    }) => {
      const transaction: TreasuryTransaction = {
        id: crypto.randomUUID(),
        type: params.type,
        amount: Math.round(Math.max(0, params.amount) * 100) / 100,
        user: params.user.trim(),
        beneficiary: params.beneficiary.trim(),
        note: params.note.trim(),
        source: params.source ?? "manual",
        createdAt: new Date().toISOString(),
      };

      persist([transaction, ...transactions]);
      return transaction;
    },
    [persist, transactions]
  );

  const addInvoiceIncomeTransaction = useCallback(
    (params: {
      amount: number;
      beneficiary: string;
      note: string;
      user?: string;
    }) => {
      if (params.amount <= 0) return null;

      return addTransaction({
        type: "in",
        amount: params.amount,
        user: params.user?.trim() || "النظام",
        beneficiary: params.beneficiary,
        note: params.note,
        source: "invoice",
      });
    },
    [addTransaction]
  );

  const { currentBalance, totalIn, totalOut } = useMemo(() => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "in") {
          acc.totalIn += transaction.amount;
        } else {
          acc.totalOut += transaction.amount;
        }
        return acc;
      },
      { totalIn: 0, totalOut: 0 }
    );

    return {
      totalIn: Math.round(totals.totalIn * 100) / 100,
      totalOut: Math.round(totals.totalOut * 100) / 100,
      currentBalance:
        Math.round((totals.totalIn - totals.totalOut) * 100) / 100,
    };
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      currentBalance,
      totalIn,
      totalOut,
      addTransaction,
      addInvoiceIncomeTransaction,
    }),
    [
      transactions,
      currentBalance,
      totalIn,
      totalOut,
      addTransaction,
      addInvoiceIncomeTransaction,
    ]
  );

  return (
    <TreasuryContext.Provider value={value}>
      {children}
    </TreasuryContext.Provider>
  );
}

export function useTreasury() {
  const ctx = useContext(TreasuryContext);
  if (!ctx) {
    throw new Error("useTreasury must be used within TreasuryProvider");
  }
  return ctx;
}
