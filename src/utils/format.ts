export function formatCurrency(value: number): string {
  return `${value.toLocaleString("ar-TN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} د.ت`;
}

export function formatCurrencyPrint(value: number): string {
  return `${value.toFixed(2)} د.ت`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("ar-TN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDatePrint(date: string): string {
  return new Intl.DateTimeFormat("ar-TN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatWeight(value: number): string {
  return `${value.toFixed(2)} كغ`;
}

export function formatWeightPrint(value: number): string {
  return `${value.toFixed(2)}كغ`;
}

export function capitalizeUnit(unit: string): string {
  return unit.charAt(0).toUpperCase() + unit.slice(1);
}

export function formatInvoiceCount(count: number): string {
  if (count === 1) return "فاتورة واحدة";
  if (count === 2) return "فاتورتان";
  if (count >= 3 && count <= 10) return `${count} فواتير`;
  return `${count} فاتورة`;
}

export function getDateInputValue(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateInput(): string {
  return getDateInputValue(new Date());
}

export function formatDateInputLabel(dateInput: string): string {
  const [year, month, day] = dateInput.split("-").map(Number);
  return formatDate(new Date(year, month - 1, day).toISOString());
}
