import { format } from "date-fns";
import { formatAmount } from "@/lib/format";

const DIVIDER = "-----------------------------------";
const BOLD_DIGITS = "𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";

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

type ReportLine = {
  text: string;
  emphasize?: boolean;
};

function sumPrices(items: ReportReceipt[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function receiptLines(
  items: ReportReceipt[],
  empty = "없음",
  absolute = false,
): ReportLine[] {
  if (items.length === 0) {
    return [{ text: empty }];
  }

  return items.map((item) => ({
    text: `${item.memo} : ${formatAmount(absolute ? Math.abs(item.price) : item.price)}`,
  }));
}

function emphasize(text: string): ReportLine {
  return { text, emphasize: true };
}

function toBoldDigits(value: string) {
  return value.replace(/[0-9]/g, (digit) => BOLD_DIGITS[Number(digit)] ?? digit);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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

  const lines: ReportLine[] = [
    { text: `[${format(new Date(item.totalAt), "M월 d일")} 지출 및 현재잔고]` },
    { text: "" },
    { text: `전일 잔고 : ${formatAmount(item.yesterDayTotal)}` },
    { text: "" },
    { text: DIVIDER },
    { text: "<잠긴 잔고>" },
    ...receiptLines(locked),
    { text: "" },
    { text: "<현 잔고>" },
    ...receiptLines(currentItems),
    { text: "" },
    { text: DIVIDER },
    { text: "<잔고 합계>" },
    { text: `잠긴잔고 : ${formatAmount(lockedTotal)}` },
    { text: `현 잔고 : ${formatAmount(currentTotal)}` },
    { text: "" },
    emphasize(`잔고 총액 : ${formatAmount(item.todayTotal)}`),
    { text: DIVIDER },
    { text: "<영업이익 / 유저보유>" },
    { text: `영업이익 : ${formatAmount(item.solutionTotal)}` },
    { text: `유저보유 : ${formatAmount(item.userHoldings ?? 0)}` },
    { text: "" },
    { text: DIVIDER },
    { text: "<지출내역>" },
    ...receiptLines(item.withdraw, "없음", true),
    { text: "" },
    emphasize(`지출내역 합계 : ${formatAmount(Math.abs(item.withdrawTotal))}`),
    { text: "" },
    { text: DIVIDER },
    { text: "<입금내역>" },
    ...receiptLines(item.deposit),
    { text: "" },
    emphasize(`입금내역 합계 : ${formatAmount(item.depositTotal)}`),
    { text: "" },
    { text: DIVIDER },
    emphasize(`오차금액 : ${formatAmount(item.marginTotla)}`),
    { text: "" },
  ];

  return {
    text: lines
      .map((line) => (line.emphasize ? toBoldDigits(line.text) : line.text))
      .join("\n"),
    html: `<pre style="margin:0;font-family:inherit">${lines
      .map((line) => {
        const content = escapeHtml(line.text) || " ";
        return line.emphasize ? `<b>${content}</b>` : content;
      })
      .join("\n")}</pre>`,
  };
}

export async function copySettlementReport(item: SettlementReportInput) {
  const report = formatSettlementReport(item);

  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([report.text], { type: "text/plain" }),
          "text/html": new Blob([report.html], { type: "text/html" }),
        }),
      ]);
      return;
    } catch {
      // Some browsers reject mixed clipboard types; plain text still keeps bold digits.
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(report.text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = report.text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  document.body.removeChild(field);
}
