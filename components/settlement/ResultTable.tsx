"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { confirmSettlement } from "@/app/actions/settlement";
import { formatAmount, formatDate, isSundayDate } from "@/lib/format";
import { copySettlementReport } from "@/lib/report";
import { isAdmin } from "@/lib/roles";

type Receipt = {
  id: number;
  memo: string;
  price: number;
};

export type SettlementRow = {
  id: number;
  totalAt: Date | string;
  createAt: Date | string;
  yesterDayTotal: number;
  todayTotal: number;
  solutionTotal: number;
  userHoldings?: number;
  marginTotla: number;
  confirm: boolean;
  withdraw: Receipt[];
  deposit: Receipt[];
  balance: Receipt[];
  lockedBalance?: Receipt[];
  withdrawCount: number;
  withdrawTotal: number;
  depositCount: number;
  depositTotal: number;
};

export default function ResultTable({
  list,
  listCount,
  page,
  rowsPerPage,
  level,
  highlightMemo,
}: {
  list: SettlementRow[];
  listCount: number;
  page: number;
  rowsPerPage: number;
  level: string;
  highlightMemo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [copyingId, setCopyingId] = useState<number | null>(null);

  const pushParams = (next: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => params.set(key, value));
    router.push(`${pathname}?${params.toString()}`);
  };

  const onCopy = async (item: SettlementRow) => {
    if (copyingId === item.id) return;
    setCopyingId(item.id);
    try {
      await copySettlementReport(item);
      setCopied(true);
    } catch {
      alert("복사에 실패했습니다");
    } finally {
      setCopyingId(null);
    }
  };

  const onConfirm = (id: number) => {
    if (pending) return;
    startTransition(async () => {
      const result = await confirmSettlement(id);
      if (result.ok === false && result.message) {
        alert(result.message);
      }
      router.refresh();
    });
  };

  return (
    <Box sx={{ display: "flex", width: "100%", mt: 2, mb: 5 }}>
      <TableContainer component={Paper}>
        <Table aria-label="settlement list">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {[
                { label: "날짜", align: "left" as const },
                { label: "입출손익", align: "center" as const },
                { label: "유저보유", align: "center" as const },
                { label: "지출 / 건수", align: "center" as const },
                { label: "입금 / 건수", align: "center" as const },
                { label: "오차", align: "center" as const },
                { label: "처리일", align: "center" as const },
                { label: "잔고총액", align: "center" as const },
                { label: "상태", align: "right" as const },
              ].map((column) => (
                <TableCell
                  key={column.label}
                  width={column.label === "날짜" ? "15%" : undefined}
                  align={column.align}
                >
                  <Typography
                    sx={{
                      fontSize: "small",
                      fontWeight: "bold"
                    }}>
                    {column.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="left">
                  <Typography
                    color={isSundayDate(item.totalAt) ? "error" : undefined}
                    sx={{
                      fontSize: "small",
                      fontWeight: "bold"
                    }}>
                    {formatDate(item.totalAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color={item.solutionTotal < 0 ? "error" : undefined}
                    sx={{
                      fontSize: "small",
                      fontWeight: "bold"
                    }}>
                    {formatAmount(item.solutionTotal)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color={(item.userHoldings ?? 0) < 0 ? "error" : undefined}
                    sx={{
                      fontSize: "small",
                      fontWeight: "bold"
                    }}>
                    {formatAmount(item.userHoldings ?? 0)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <ReceiptCell
                    items={item.withdraw}
                    total={item.withdrawTotal}
                    count={item.withdrawCount}
                    emphasizeTotal
                    highlightMemo={highlightMemo}
                  />
                </TableCell>
                <TableCell align="center">
                  <ReceiptCell
                    items={item.deposit}
                    total={item.depositTotal}
                    count={item.depositCount}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography
                    color={item.marginTotla < 0 ? "error" : undefined}
                    sx={{
                      fontSize: "small",
                      fontWeight: "bold"
                    }}>
                    {formatAmount(item.marginTotla)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{
                      fontSize: "small",
                      fontWeight: "bold"
                    }}>
                    {formatDate(item.createAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip
                    title={
                      (item.lockedBalance?.length ?? 0) > 0 ||
                      item.balance.length > 0 ? (
                        <Box sx={{ width: 220 }}>
                          {(item.lockedBalance?.length ?? 0) > 0 ? (
                            <BalanceTooltipGroup
                              title="잠긴잔고"
                              items={item.lockedBalance ?? []}
                            />
                          ) : null}
                          {item.balance.length > 0 ? (
                            <BalanceTooltipGroup
                              title="현잔고"
                              items={item.balance}
                            />
                          ) : null}
                        </Box>
                      ) : (
                        ""
                      )
                    }
                  >
                    <Typography
                      color={item.todayTotal < 0 ? "error" : undefined}
                      sx={{
                        fontSize: "small",
                        fontWeight: "bold",
                      }}
                    >
                      {formatAmount(item.todayTotal)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => onCopy(item)}
                      disabled={copyingId === item.id}
                      sx={{ p: 0, minWidth: 52 }}
                    >
                      <Typography sx={{ fontSize: "small", fontWeight: "bold" }}>
                        복사
                      </Typography>
                    </Button>
                    {item.confirm ? (
                      <Typography
                        sx={{
                          fontSize: "small",
                          fontWeight: "bold"
                        }}>
                        정산완료
                      </Typography>
                    ) : (
                      <>
                        <Link href={`/edit/${item.id}`}>
                          <Button
                            size="small"
                            sx={{ p: 0 }}
                            variant="outlined"
                            color="warning"
                          >
                            <Typography
                              sx={{
                                fontSize: "small",
                                fontWeight: "bold"
                              }}>
                              수정
                            </Typography>
                          </Button>
                        </Link>
                        {isAdmin(level) ? (
                          <Button
                            size="small"
                            sx={{ p: 0 }}
                            variant="contained"
                            color="success"
                            disabled={pending}
                            onClick={() => onConfirm(item.id)}
                          >
                            <Typography
                              sx={{
                                fontSize: "small",
                                fontWeight: "bold"
                              }}>
                              확정
                            </Typography>
                          </Button>
                        ) : null}
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={listCount}
          onPageChange={(_event, newPage) => pushParams({ page: String(newPage) })}
          onRowsPerPageChange={(event) =>
            pushParams({
              rowsPerPage: event.target.value,
              page: "0",
            })
          }
          page={listCount <= 0 ? 0 : page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 30]}
        />
      </TableContainer>
      <Snackbar
        open={copied}
        autoHideDuration={1800}
        onClose={() => setCopied(false)}
        message="보고 메시지를 복사했습니다"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

function BalanceTooltipGroup({
  title,
  items,
}: {
  title: string;
  items: Receipt[];
}) {
  return (
    <Box sx={{ mb: 0.75, "&:last-of-type": { mb: 0 } }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: 0.8, mb: 0.25 }}>
        {title}
      </Typography>
      {items.map((row) => (
        <Box
          key={row.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: "small" }}>{row.memo}</Typography>
          <Typography sx={{ fontSize: "small" }}>
            {formatAmount(row.price)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function ReceiptCell({
  items,
  total,
  count,
  emphasizeTotal,
  highlightMemo,
}: {
  items: Receipt[];
  total: number;
  count: number;
  emphasizeTotal?: boolean;
  highlightMemo?: string;
}) {
  return (
    <Tooltip
      title={
        items.length > 0 ? (
          <Box sx={{
            width: 220
          }}>
            {items.map((item) => {
              const matched = Boolean(highlightMemo) && item.memo === highlightMemo;
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: matched ? 700 : 400,
                  }}
                >
                  <Typography sx={{
                    fontSize: "small",
                    fontWeight: matched ? 700 : 400,
                  }}>{item.memo}</Typography>
                  <Typography sx={{
                    fontSize: "small",
                    fontWeight: matched ? 700 : 400,
                  }}>{formatAmount(item.price)}</Typography>
                </Box>
              );
            })}
          </Box>
        ) : (
          ""
        )
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center"
        }}>
        <Typography
          color={emphasizeTotal ? "error" : undefined}
          sx={{
            fontSize: "small",
            fontWeight: "bold"
          }}>
          {formatAmount(total)}
        </Typography>
        <Typography
          sx={{
            fontSize: "small",
            fontWeight: "bold",
            px: 0.5
          }}>
          /
        </Typography>
        <Typography
          sx={{
            fontSize: "small",
            fontWeight: "bold"
          }}>
          {formatAmount(count)} 건
        </Typography>
      </Box>
    </Tooltip>
  );
}
