export interface PawnPackLine {
  productName: string;
  packName: string;
  quantity: number;
  packPrice: number;
  linePackTotal: number;
}

export interface PawnRecord {
  id: string;
  code: string;
  invoiceId: string;
  invoiceDbId: string;
  clientId: string;
  clientName: string;
  packDepositTotal: number;
  lines: PawnPackLine[];
  createdAt: string;
}
