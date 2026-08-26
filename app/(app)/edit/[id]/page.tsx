import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import SettlementForm from "@/components/settlement/SettlementForm";
import { getSettlementById, getWithdrawMemos } from "@/lib/settlement";

export const metadata: Metadata = {
  title: "정산 수정",
};

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const settlementId = Number(id);

  if (!Number.isFinite(settlementId)) {
    notFound();
  }

  const data = await getSettlementById(settlementId);
  if (!data) {
    notFound();
  }
  const withdrawMemos = await getWithdrawMemos();

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
      <Container maxWidth="xl">
        <SettlementForm
          mode="edit"
          yesterdayTotal={data.yesterDayTotal}
          withdrawMemos={withdrawMemos}
          initial={{
            id: data.id,
            totalAt: data.totalAt,
            todayTotal: data.todayTotal,
            solutionTotal: data.solutionTotal,
            userHoldings: data.userHoldings,
            balance: data.balance.map((item) => ({
              memo: item.memo,
              price: item.price,
            })),
            lockedBalance: data.lockedBalance.map((item) => ({
              memo: item.memo,
              price: item.price,
            })),
            withdraw: data.withdraw.map((item) => ({
              memo: item.memo,
              price: item.price,
            })),
            deposit: data.deposit.map((item) => ({
              memo: item.memo,
              price: item.price,
            })),
          }}
        />
      </Container>
    </Box>
  );
}
