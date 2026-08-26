export type ReceiptItem = {
  memo: string;
  price: number;
};

export function sumReceipts(items: ReceiptItem[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function calcMarginTotal({
  yesterdayTotal,
  todayTotal,
  solutionTotal,
  withdraw,
  deposit,
}: {
  yesterdayTotal: number;
  todayTotal: number;
  solutionTotal: number;
  withdraw: ReceiptItem[];
  deposit: ReceiptItem[];
}) {
  return (
    (yesterdayTotal -
      todayTotal +
      solutionTotal +
      sumReceipts(withdraw) +
      sumReceipts(deposit)) *
    -1
  );
}
