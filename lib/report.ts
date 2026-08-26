import { format } from "date-fns";
import { formatAmount } from "@/lib/format";

const DIVIDER = "-----------------------------------";

export type ReportReceipt = {
  memo: string;
  price: number;
};

export type SettlementReportInput = {
  totalAt: Date | string;
  yesterDayTotal: number;
  todayTotal: number;
  solutionTotal: number;
  userHoldings?: number;
  marginTotla: number;
  balance: ReportReceipt[];
  lockedBalance?: ReportReceipt[];
  withdraw: ReportReceipt[];
  deposit: ReportReceipt[];
  withdrawTotal: number;
  depositTotal: number;
};

function sumPrices(items: ReportReceipt[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function receiptLines(
  items: ReportReceipt[],
  empty = "없음",
  absolute = false,
) {
  if (items.length === 0) {
    return empty;
  }

  return items
    .map(
      (item) =>
        `${item.memo} : ${formatAmount(absolute ? Math.abs(item.price) : item.price)}`,
    )
    .join("\n");
}

export function formatSettlementReport(item: SettlementReportInput) {
  const locked = item.lockedBalance ?? [];
  const lockedTotal = sumPrices(locked);
  const currentItems =
    item.balance.length > 0
      ? item.balance
      : item.todayTotal - lockedTotal !== 0
        ? [{ memo: "현 잔고", price: item.todayTotal - lockedTotal }]
        : [];
  const currentTotal = sumPrices(currentItems);

  return [
    `[${format(new Date(item.totalAt), "M월 d일")} 지출 및 현재잔고]`,
    "",
    `전일 잔고 : ${formatAmount(item.yesterDayTotal)}`,
    "",
    DIVIDER,
    "<잠긴 잔고>",
    receiptLines(locked),
    "",
    `잠긴잔고 총액 : ${formatAmount(lockedTotal)}`,
    DIVIDER,
    "<현 잔고>",
    receiptLines(currentItems),
    "",
    `현잔고 총액 : ${formatAmount(currentTotal)}`,
    DIVIDER,
    `잔고 총액 : ${formatAmount(item.todayTotal)}`,
    DIVIDER,
    "<영업이익 / 유저보유>",
    `영업이익 : ${formatAmount(item.solutionTotal)}`,
    `유저보유 : ${formatAmount(item.userHoldings ?? 0)}`,
    DIVIDER,
    "<지출내역>",
    receiptLines(item.withdraw, "없음", true),
    "",
    `지출내역 합계 : ${formatAmount(Math.abs(item.withdrawTotal))}`,
    DIVIDER,
    "<입금내역>",
    receiptLines(item.deposit),
    "",
    `입금내역 합계 : ${formatAmount(item.depositTotal)}`,
    DIVIDER,
    `오차금액 : ${formatAmount(item.marginTotla)}`,
  ].join("\n");
}

export async function copySettlementReport(item: SettlementReportInput) {
  const text = formatSettlementReport(item);

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  document.body.removeChild(field);
}
