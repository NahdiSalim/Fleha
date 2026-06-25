import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PawnPackLine, PawnRecord } from "../types/pawn";

const STORAGE_KEY = "falah-pawn-data-v1";

interface PawnContextValue {
  records: PawnRecord[];
  createPawnRecord: (params: {
    code: string;
    invoiceId: string;
    invoiceDbId: string;
    clientId: string;
    clientName: string;
    packDepositTotal: number;
    lines: PawnPackLine[];
  }) => PawnRecord;
  settlePawnRecord: (id: string) => PawnRecord | null;
  findByCode: (code: string) => PawnRecord | undefined;
}

const PawnContext = createContext<PawnContextValue | null>(null);

function loadRecords(): PawnRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as PawnRecord[];
    }
  } catch {
    // fall through
  }

  return [];
}

export function PawnProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<PawnRecord[]>(loadRecords);

  const persist = useCallback((next: PawnRecord[]) => {
    setRecords(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const createPawnRecord = useCallback(
    (params: {
      code: string;
      invoiceId: string;
      invoiceDbId: string;
      clientId: string;
      clientName: string;
      packDepositTotal: number;
      lines: PawnPackLine[];
    }) => {
      const record: PawnRecord = {
        id: crypto.randomUUID(),
        code: params.code.trim().toUpperCase(),
        invoiceId: params.invoiceId,
        invoiceDbId: params.invoiceDbId,
        clientId: params.clientId,
        clientName: params.clientName,
        packDepositTotal: params.packDepositTotal,
        lines: params.lines,
        createdAt: new Date().toISOString(),
      };

      persist([record, ...records]);
      return record;
    },
    [persist, records]
  );

  const settlePawnRecord = useCallback(
    (id: string) => {
      const record = records.find((item) => item.id === id);
      if (!record) return null;

      persist(records.filter((item) => item.id !== id));
      return record;
    },
    [persist, records]
  );

  const findByCode = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (!normalized) return undefined;
      return records.find((item) => item.code.toUpperCase() === normalized);
    },
    [records]
  );

  const value = useMemo(
    () => ({
      records,
      createPawnRecord,
      settlePawnRecord,
      findByCode,
    }),
    [records, createPawnRecord, settlePawnRecord, findByCode]
  );

  return <PawnContext.Provider value={value}>{children}</PawnContext.Provider>;
}

export function usePawn() {
  const ctx = useContext(PawnContext);
  if (!ctx) {
    throw new Error("usePawn must be used within PawnProvider");
  }
  return ctx;
}
