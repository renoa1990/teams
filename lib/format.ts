import { format } from "date-fns";
import { ko } from "date-fns/locale";

const SEOUL = "Asia/Seoul";
const amountFormatter = new Intl.NumberFormat("ko-KR");

export function formatAmount(value: number | null | undefined) {
  return amountFormatter.format(value ?? 0);
}

function seoulParts(value: Date | string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(read("year")),
    month: Number(read("month")),
    day: Number(read("day")),
  };
}

function toSeoulNoon(value: Date | string) {
  const { year, month, day } = seoulParts(value);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function formatDate(value: Date | string) {
  return format(toSeoulNoon(value), "yyyy-MM-dd (eee)", { locale: ko });
}

export function isSundayDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SEOUL,
    weekday: "short",
  })
    .format(new Date(value))
    .startsWith("Sun");
}

export function toDateInputValue(value: Date | string) {
  const { year, month, day } = seoulParts(value);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatSeoulMonthDay(value: Date | string) {
  const { month, day } = seoulParts(value);
  return `${month}월 ${day}일`;
}

export function parseSettlementDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 5, 0, 0, 0));
}

export function isSameSettlementDay(left: Date, right: Date) {
  const a = seoulParts(left);
  const b = seoulParts(right);
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isFutureSettlementDate(dateData: Date) {
  return dateData.getTime() > Date.now();
}
