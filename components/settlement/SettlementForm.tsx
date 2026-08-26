"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  createSettlement,
  deleteSettlement,
  updateSettlement,
} from "@/app/actions/settlement";
import { calcMarginTotal, sumReceipts, type ReceiptItem } from "@/lib/calc";
import { formatAmount, toDateInputValue } from "@/lib/format";
import AmountField from "@/components/settlement/AmountField";
import FieldSection from "@/components/settlement/FieldSection";
import LineItemRow from "@/components/settlement/LineItemRow";

type SettlementFormProps = {
  mode: "create" | "edit";
  yesterdayTotal: number;
  withdrawMemos?: string[];
  previousLockedBalance?: ReceiptItem[];
  initial?: {
    id: number;
    totalAt: Date | string;
    todayTotal: number;
    solutionTotal: number;
    userHoldings?: number;
    balance: ReceiptItem[];
    lockedBalance?: ReceiptItem[];
    withdraw: ReceiptItem[];
    deposit: ReceiptItem[];
  };
};

export default function SettlementForm({
  mode,
  yesterdayTotal,
  withdrawMemos = [],
  previousLockedBalance = [],
  initial,
}: SettlementFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [date, setDate] = useState<Date | null>(
    initial?.totalAt ? new Date(initial.totalAt) : null,
  );
  const [lockedMoney, setLockedMoney] = useState<number | undefined>(0);
  const [lockedMemo, setLockedMemo] = useState("");
  const [money, setMoney] = useState<number | undefined>(0);
  const [moneyMemo, setMoneyMemo] = useState("");
  const [total, setTotal] = useState<number | undefined>(0);
  const [confirmTotal, setConfirmTotal] = useState<ReceiptItem>({
    memo: initial ? "입출손익" : "",
    price: initial?.solutionTotal ?? 0,
  });
  const [holdingsDraft, setHoldingsDraft] = useState<number | undefined>(0);
  const [userHoldings, setUserHoldings] = useState<ReceiptItem>({
    memo: initial ? "유저보유" : "",
    price: initial?.userHoldings ?? 0,
  });
  const [withdraw, setWithdraw] = useState<number | undefined>(0);
  const [withdrawMemo, setWithdrawMemo] = useState("");
  const [deposit, setDeposit] = useState<number | undefined>(0);
  const [depositMemo, setDepositMemo] = useState("");
  const [lockedReceipt, setLockedReceipt] = useState<ReceiptItem[]>(
    initial?.lockedBalance ?? previousLockedBalance,
  );
  const [balanceReceipt, setBalanceReceipt] = useState<ReceiptItem[]>(
    initial?.balance && initial.balance.length > 0
      ? initial.balance
      : initial && (!initial.lockedBalance || initial.lockedBalance.length === 0)
        ? [{ memo: "현 잔고", price: initial.todayTotal }]
        : [],
  );
  const [withdrawReceipt, setWithdrawReceipt] = useState<ReceiptItem[]>(
    initial?.withdraw ?? [],
  );
  const [depositReceipt, setDepositReceipt] = useState<ReceiptItem[]>(
    initial?.deposit ?? [],
  );
  const [withdrawMemoOptions, setWithdrawMemoOptions] = useState(withdrawMemos);

  const todayTotal = useMemo(
    () => sumReceipts(lockedReceipt) + sumReceipts(balanceReceipt),
    [lockedReceipt, balanceReceipt],
  );

  const marginTotal = useMemo(() => {
    if (
      (lockedReceipt.length === 0 && balanceReceipt.length === 0) ||
      !confirmTotal.memo
    ) {
      return 0;
    }
    return calcMarginTotal({
      yesterdayTotal,
      todayTotal,
      solutionTotal: confirmTotal.price,
      withdraw: withdrawReceipt,
      deposit: depositReceipt,
    });
  }, [
    yesterdayTotal,
    todayTotal,
    confirmTotal,
    withdrawReceipt,
    depositReceipt,
    lockedReceipt.length,
    balanceReceipt.length,
  ]);

  const inputTotal = (price?: number) => {
    if (price === undefined) return;
    setConfirmTotal({ memo: "입출손익", price });
    setTotal(0);
  };

  const inputHoldings = (price?: number) => {
    if (price === undefined) return;
    setUserHoldings({ memo: "유저보유", price });
    setHoldingsDraft(0);
  };

  const addReceipt = (type: "locked" | "balance" | "withdraw" | "deposit") => {
    if (type === "locked") {
      if (!lockedMoney || !lockedMemo) return;
      setLockedReceipt((current) => [
        ...current,
        { memo: lockedMemo, price: lockedMoney },
      ]);
      setLockedMemo("");
      setLockedMoney(0);
      return;
    }

    if (type === "balance") {
      if (!money || !moneyMemo) return;
      setBalanceReceipt((current) => [
        ...current,
        { memo: moneyMemo, price: money },
      ]);
      setMoneyMemo("");
      setMoney(0);
      return;
    }

    if (type === "withdraw") {
      if (!withdraw || !withdrawMemo) return;
      setWithdrawReceipt((current) => [
        ...current,
        { memo: withdrawMemo, price: withdraw * -1 },
      ]);
      setWithdrawMemoOptions((current) =>
        current.includes(withdrawMemo) ? current : [...current, withdrawMemo].sort(),
      );
      setWithdrawMemo("");
      setWithdraw(0);
      return;
    }

    if (!deposit || !depositMemo) return;
    setDepositReceipt((current) => [
      ...current,
      { memo: depositMemo, price: deposit },
    ]);
    setDepositMemo("");
    setDeposit(0);
  };

  const onSubmit = () => {
    if (pending) return;
    if (lockedReceipt.length === 0 && balanceReceipt.length === 0) {
      return alert("현잔고를 입력하세요");
    }
    if (!confirmTotal.memo) return alert("입출 손익을 입력하세요");
    if (mode === "create" && !date) {
      return alert("정산 날짜를 입력하세요");
    }
    if (!window.confirm("저장 하시겠습니까?")) return;

    startTransition(async () => {
      const result =
        mode === "create" && date
          ? await createSettlement({
              date: toDateInputValue(date),
              yesterdayTotal,
              solutionTotal: confirmTotal.price,
              userHoldings: userHoldings.memo ? userHoldings.price : 0,
              balance: balanceReceipt,
              lockedBalance: lockedReceipt,
              withdraw: withdrawReceipt,
              deposit: depositReceipt,
            })
          : initial
            ? await updateSettlement({
                id: initial.id,
                solutionTotal: confirmTotal.price,
                userHoldings: userHoldings.memo ? userHoldings.price : 0,
                balance: balanceReceipt,
                lockedBalance: lockedReceipt,
                withdraw: withdrawReceipt,
                deposit: depositReceipt,
              })
            : { ok: false as const, message: "저장에 실패했습니다" };

      if (result.ok) {
        alert(mode === "create" ? "정산입력이 완료되었습니다." : "저장이 완료되었습니다");
        router.push("/result");
        router.refresh();
        return;
      }

      alert(result.message);
    });
  };

  const onDelete = () => {
    if (!initial || pending) return;
    if (!window.confirm("삭제 하시겠습니까?")) return;

    startTransition(async () => {
      const result = await deleteSettlement(initial.id);
      if (result.ok) {
        alert("삭제가 완료되었습니다");
        router.push("/result");
        router.refresh();
        return;
      }
      alert(result.message);
    });
  };

  return (
    <Box sx={{ width: "100%", mt: { xs: 2, md: 3 }, pb: 6 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
            <FieldSection title="정산 날짜">
              <DatePicker
                disabled={mode === "edit"}
                onChange={(newDate) => setDate(newDate)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { "& input": { fontWeight: 700 } },
                  },
                }}
                value={date}
                format="yyyy-MM-dd"
              />
            </FieldSection>

            <FieldSection
              title="잠긴잔고"
              hint={
                mode === "create"
                  ? "이전 정산의 잠긴잔고가 미리 들어갑니다. 수정하거나 줄을 더 넣을 수 있습니다."
                  : "잠긴 금액을 나눠 입력하세요. 합계는 현 잔고에 포함됩니다."
              }
            >
              <LineItemRow
                memo={lockedMemo}
                amount={lockedMoney}
                onMemoChange={setLockedMemo}
                onAmountChange={setLockedMoney}
                onSubmit={() => addReceipt("locked")}
                memoPlaceholder="예) 롤링, 잠김"
              />
            </FieldSection>

            <FieldSection
              title="현 잔고"
              hint="가상, 뒷장 등을 나눠 입력하면 오른쪽에서 합산됩니다. Enter로도 넣을 수 있습니다."
            >
              <LineItemRow
                memo={moneyMemo}
                amount={money}
                onMemoChange={setMoneyMemo}
                onAmountChange={setMoney}
                onSubmit={() => addReceipt("balance")}
                memoPlaceholder="예) 가상, 뒷장"
              />
            </FieldSection>

            <FieldSection
              title="입출손익"
              hint="솔루션상 당일 입출 손익입니다. 음수는 - 입력 후 금액을 넣으세요."
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "minmax(0, 1fr) 96px",
                  },
                  gap: 1.25,
                }}
              >
                <AmountField
                  value={total}
                  onValueChange={setTotal}
                  onEnter={() => inputTotal(total)}
                  sx={{ width: "100%" }}
                />
                <Button
                  variant="contained"
                  onClick={() => inputTotal(total)}
                  sx={{ minHeight: { xs: 48, sm: 56 }, fontWeight: 700 }}
                >
                  입력
                </Button>
              </Box>
            </FieldSection>

            <FieldSection
              title="유저보유"
              hint="기록용입니다. 오차·잔고 합계에는 반영되지 않습니다."
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "minmax(0, 1fr) 96px",
                  },
                  gap: 1.25,
                }}
              >
                <AmountField
                  value={holdingsDraft}
                  onValueChange={setHoldingsDraft}
                  onEnter={() => inputHoldings(holdingsDraft)}
                  sx={{ width: "100%" }}
                />
                <Button
                  variant="contained"
                  onClick={() => inputHoldings(holdingsDraft)}
                  sx={{ minHeight: { xs: 48, sm: 56 }, fontWeight: 700 }}
                >
                  입력
                </Button>
              </Box>
            </FieldSection>

            <FieldSection
              title="지출내역"
              hint="이전 내역에서 고르거나 새로 입력하세요. 같은 이름으로 넣어야 정산확인에서 검색됩니다."
            >
              <LineItemRow
                memo={withdrawMemo}
                amount={withdraw}
                onMemoChange={setWithdrawMemo}
                onAmountChange={setWithdraw}
                onSubmit={() => addReceipt("withdraw")}
                memoPlaceholder="지출 내역 선택 또는 입력"
                memoOptions={withdrawMemoOptions}
              />
            </FieldSection>

            <FieldSection title="입금내역" hint="내역과 금액을 함께 입력하세요.">
              <LineItemRow
                memo={depositMemo}
                amount={deposit}
                onMemoChange={setDepositMemo}
                onAmountChange={setDeposit}
                onSubmit={() => addReceipt("deposit")}
                memoLabel="메모"
                memoPlaceholder="입금 메모"
              />
            </FieldSection>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: { md: "sticky" }, top: 24 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table aria-label="settlement summary" size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell width="54%" sx={{ backgroundColor: "#f5f5f5", py: 1.5 }}>
                      <Typography color="primary" sx={{ fontWeight: 700 }}>
                        전일 잔고
                      </Typography>
                    </TableCell>
                    <TableCell
                      width="46%"
                      sx={{ backgroundColor: "#f5f5f5", py: 1.5 }}
                      align="right"
                    >
                      <Typography color="primary" sx={{ fontWeight: 700 }}>
                        {formatAmount(yesterdayTotal)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lockedReceipt.map((item, index) => (
                    <SummaryRow
                      key={`locked-${index}`}
                      label={`잠긴잔고${index + 1}. ${item.memo}`}
                      amount={item.price}
                      onRemove={() =>
                        setLockedReceipt((current) =>
                          current.filter((_, idx) => idx !== index),
                        )
                      }
                    />
                  ))}
                  {balanceReceipt.map((item, index) => (
                    <SummaryRow
                      key={`balance-${index}`}
                      label={`현잔고${index + 1}. ${item.memo}`}
                      amount={item.price}
                      onRemove={() =>
                        setBalanceReceipt((current) =>
                          current.filter((_, idx) => idx !== index),
                        )
                      }
                    />
                  ))}
                  <SummaryRow label="현 잔고 합계" amount={todayTotal} emphasize />
                  <SummaryRow
                    label="입출손익"
                    amount={confirmTotal.price}
                    onRemove={
                      confirmTotal.memo
                        ? () => setConfirmTotal({ memo: "", price: 0 })
                        : undefined
                    }
                  />
                  {userHoldings.memo ? (
                    <SummaryRow
                      label="유저보유"
                      amount={userHoldings.price}
                      onRemove={() => setUserHoldings({ memo: "", price: 0 })}
                    />
                  ) : null}
                  {withdrawReceipt.map((item, index) => (
                    <SummaryRow
                      key={`withdraw-${index}`}
                      label={`출금${index + 1}. ${item.memo}`}
                      amount={item.price}
                      onRemove={() =>
                        setWithdrawReceipt((current) =>
                          current.filter((_, idx) => idx !== index),
                        )
                      }
                    />
                  ))}
                  {depositReceipt.map((item, index) => (
                    <SummaryRow
                      key={`deposit-${index}`}
                      label={`입금${index + 1}. ${item.memo}`}
                      amount={item.price}
                      onRemove={() =>
                        setDepositReceipt((current) =>
                          current.filter((_, idx) => idx !== index),
                        )
                      }
                    />
                  ))}
                  <SummaryRow label="오차" amount={marginTotal} strong />
                </TableBody>
              </Table>
            </TableContainer>
            <Typography color="text.secondary" align="right" sx={{ fontSize: 13, m: 1.5 }}>
              ※ 금액이 - 인 경우 정산금액보다 부족함
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={onSubmit}
              disabled={pending}
              sx={{ fontWeight: 700, py: 1.5 }}
            >
              {mode === "create" ? "정산완료" : "수정하기"}
            </Button>
            {mode === "edit" ? (
              <Button
                fullWidth
                variant="contained"
                onClick={onDelete}
                disabled={pending}
                sx={{ mt: 1.25, fontWeight: 700, py: 1.5 }}
                color="error"
              >
                삭제
              </Button>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function SummaryRow({
  label,
  amount,
  onRemove,
  emphasize,
  strong,
}: {
  label: string;
  amount: number;
  onRemove?: () => void;
  emphasize?: boolean;
  strong?: boolean;
}) {
  return (
    <TableRow>
      <TableCell sx={{ py: 1.25 }}>
        <Typography
          color={emphasize || amount < 0 ? "error" : undefined}
          sx={{ fontWeight: 700, fontSize: strong ? 16 : 14 }}
        >
          {label}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1.25 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 0.5,
          }}
        >
          <Typography
            color={emphasize || amount < 0 ? "error" : undefined}
            sx={{ fontWeight: 700, fontSize: strong ? 16 : 14 }}
          >
            {formatAmount(amount)}
          </Typography>
          {onRemove ? (
            <Button color="error" onClick={onRemove} sx={{ py: 0, minWidth: 0 }}>
              삭제
            </Button>
          ) : null}
        </Box>
      </TableCell>
    </TableRow>
  );
}
