import { Suspense } from "react";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ResultTable from "@/components/settlement/ResultTable";
import WithdrawMemoFilter from "@/components/settlement/WithdrawMemoFilter";
import { requireUser } from "@/lib/auth";
import {
  getSettlementList,
  getWithdrawMemos,
  parsePage,
  parseRowsPerPage,
  parseWithdrawMemo,
} from "@/lib/settlement";

export const metadata: Metadata = {
  title: "정산 리스트",
};

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    rowsPerPage?: string;
    withdrawMemo?: string;
  }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const page = parsePage(params.page);
  const rowsPerPage = parseRowsPerPage(params.rowsPerPage);
  const withdrawMemo = parseWithdrawMemo(params.withdrawMemo);
  const [{ count, list }, withdrawMemos] = await Promise.all([
    getSettlementList(page, rowsPerPage, withdrawMemo || undefined),
    getWithdrawMemos(),
  ]);

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Suspense>
          <WithdrawMemoFilter memos={withdrawMemos} value={withdrawMemo} />
        </Suspense>
        <ResultTable
          level={user.level}
          list={list}
          listCount={count}
          page={page}
          rowsPerPage={rowsPerPage}
          highlightMemo={withdrawMemo}
        />
      </Container>
    </Box>
  );
}
