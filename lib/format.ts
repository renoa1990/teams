import { format, isSunday } from "date-fns";
import { ko } from "date-fns/locale";

const amountFormatter = new Intl.NumberFormat("ko-KR");

export function formatAmount(value: number | null | undefined) {
  return amountFormatter.format(value ?? 0);
}

export function formatDate(value: Date | string) {
  return format(new Date(value), "yyyy-MM-dd (eee)", { locale: ko });
}

export function isSundayDate(value: Date | string) {
  return isSunday(new Date(value));
}

export function toDateInputValue(value: Date | string) {
  return format(new Date(value), "yyyy-MM-dd");
}

export function parseSettlementDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 14, 0, 0, 0);
}

export function isSameSettlementDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}
