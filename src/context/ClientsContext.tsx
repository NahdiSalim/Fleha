import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedClients, seedInvoices } from "../data/seedClients";
import type {
  Client,
  ClientSummary,
  Invoice,
  InvoiceProduct,
} from "../types/clients";
import {
  computeInvoiceTotal,
  deriveInvoiceStatus,
  generateInvoiceId,
  updateInvoiceBalance,
} from "../utils/invoice";

const STORAGE_KEY = "falah-clients-data-v2";

interface StoredData {
  clients: Client[];
  invoices: Invoice[];
}

interface ClientsContextValue {
  clients: ClientSummary[];
  invoices: Invoice[];
  getClient: (id: string) => ClientSummary | undefined;
  getClientInvoices: (clientId: string) => Invoice[];
  getInvoice: (invoiceId: string) => Invoice | undefined;
  addClient: (name: string) => Client;
  updateClient: (id: string, name: string) => void;
  deleteClient: (id: string) => void;
  updateInvoiceBalanceDue: (invoiceId: string, balanceDue: number) => void;
  deleteInvoice: (invoiceId: string) => void;
  createInvoice: (params: {
    clientId?: string;
    newClientName?: string;
    products: InvoiceProduct[];
    paid: number;
    date?: string;
    pawnCode?: string;
    packDepositTotal?: number;
  }) => { invoice: Invoice; client: Client };
  updateInvoiceProductSupplier: (
    invoiceId: string,
    productLineId: string,
    supplier: string
  ) => void;
}

const ClientsContext = createContext<ClientsContextValue | null>(null);

function loadStoredData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StoredData;
    }
  } catch {
    // fall through to seed
  }
  return { clients: seedClients, invoices: seedInvoices };
}

function summarizeClient(client: Client, invoices: Invoice[]): ClientSummary {
  const clientInvoices = invoices.filter((inv) => inv.clientId === client.id);

  return {
    ...client,
    totalInvoiced: clientInvoices.reduce((sum, inv) => sum + inv.total, 0),
    totalPaid: clientInvoices.reduce((sum, inv) => sum + inv.paid, 0),
    balanceDue: clientInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0),
    invoiceCount: clientInvoices.length,
  };
}

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadStoredData);

  const persist = useCallback((next: StoredData) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const clients = useMemo(
    () =>
      data.clients
        .map((client) => summarizeClient(client, data.invoices))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [data.clients, data.invoices]
  );

  const invoices = useMemo(
    () =>
      [...data.invoices].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [data.invoices]
  );

  const getClient = useCallback(
    (id: string) => clients.find((c) => c.id === id),
    [clients]
  );

  const getClientInvoices = useCallback(
    (clientId: string) =>
      data.invoices
        .filter((inv) => inv.clientId === clientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data.invoices]
  );

  const getInvoice = useCallback(
    (invoiceId: string) => data.invoices.find((inv) => inv.id === invoiceId),
    [data.invoices]
  );

  const addClient = useCallback(
    (name: string) => {
      const client: Client = {
        id: crypto.randomUUID(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };
      persist({ ...data, clients: [client, ...data.clients] });
      return client;
    },
    [data, persist]
  );

  const updateClient = useCallback(
    (id: string, name: string) => {
      persist({
        ...data,
        clients: data.clients.map((c) =>
          c.id === id ? { ...c, name: name.trim() } : c
        ),
      });
    },
    [data, persist]
  );

  const deleteClient = useCallback(
    (id: string) => {
      persist({
        clients: data.clients.filter((c) => c.id !== id),
        invoices: data.invoices.filter((inv) => inv.clientId !== id),
      });
    },
    [data, persist]
  );

  const updateInvoiceBalanceDue = useCallback(
    (invoiceId: string, balanceDue: number) => {
      persist({
        ...data,
        invoices: data.invoices.map((inv) =>
          inv.id === invoiceId ? updateInvoiceBalance(inv, balanceDue) : inv
        ),
      });
    },
    [data, persist]
  );

  const deleteInvoice = useCallback(
    (invoiceId: string) => {
      persist({
        ...data,
        invoices: data.invoices.filter((inv) => inv.id !== invoiceId),
      });
    },
    [data, persist]
  );

  const createInvoice = useCallback(
    (params: {
      clientId?: string;
      newClientName?: string;
      products: InvoiceProduct[];
      paid: number;
      date?: string;
      pawnCode?: string;
      packDepositTotal?: number;
    }) => {
      let client: Client | undefined;
      let clients = data.clients;

      if (params.clientId) {
        client = data.clients.find((c) => c.id === params.clientId);
      } else if (params.newClientName?.trim()) {
        const created: Client = {
          id: crypto.randomUUID(),
          name: params.newClientName.trim(),
          createdAt: new Date().toISOString(),
        };
        client = created;
        clients = [created, ...data.clients];
      }

      if (!client) {
        throw new Error("Client is required to create an invoice");
      }

      const productsTotal = computeInvoiceTotal(params.products);
      const packDepositTotal = Math.max(0, params.packDepositTotal ?? 0);
      const total = Math.round((productsTotal + packDepositTotal) * 100) / 100;
      const paid = Math.min(Math.max(0, params.paid), total);
      const balanceDue = Math.round((total - paid) * 100) / 100;
      const invoice: Invoice = {
        id: crypto.randomUUID(),
        invoiceId: generateInvoiceId(data.invoices.map((i) => i.invoiceId)),
        clientId: client.id,
        date: params.date ?? new Date().toISOString(),
        products: params.products,
        total,
        paid,
        balanceDue,
        status: deriveInvoiceStatus(balanceDue),
        ...(params.pawnCode ? { pawnCode: params.pawnCode } : {}),
        ...(packDepositTotal > 0 ? { packDepositTotal } : {}),
      };
      persist({ ...data, clients, invoices: [invoice, ...data.invoices] });
      return { invoice, client };
    },
    [data, persist]
  );

  const updateInvoiceProductSupplier = useCallback(
    (invoiceId: string, productLineId: string, supplier: string) => {
      const nextSupplier = supplier.trim();
      if (!nextSupplier) return;

      persist({
        ...data,
        invoices: data.invoices.map((invoice) =>
          invoice.id !== invoiceId
            ? invoice
            : {
                ...invoice,
                products: invoice.products.map((product) =>
                  product.id === productLineId
                    ? { ...product, supplier: nextSupplier }
                    : product
                ),
              }
        ),
      });
    },
    [data, persist]
  );

  const value = useMemo(
    () => ({
      clients,
      invoices,
      getClient,
      getClientInvoices,
      getInvoice,
      addClient,
      updateClient,
      deleteClient,
      updateInvoiceBalanceDue,
      deleteInvoice,
      createInvoice,
      updateInvoiceProductSupplier,
    }),
    [
      clients,
      invoices,
      getClient,
      getClientInvoices,
      getInvoice,
      addClient,
      updateClient,
      deleteClient,
      updateInvoiceBalanceDue,
      deleteInvoice,
      createInvoice,
      updateInvoiceProductSupplier,
    ]
  );

  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientsContext);
  if (!ctx) {
    throw new Error("useClients must be used within ClientsProvider");
  }
  return ctx;
}
