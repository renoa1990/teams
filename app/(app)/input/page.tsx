import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SettlementForm from "@/components/settlement/SettlementForm";
import { getLastSettlementState, getWithdrawMemos } from "@/lib/settlement";

export const metadata: Metadata = {
  title: "정산 입력",
};

export default async function InputPage() {
  const state = await getLastSettlementState();
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
        {state.blocked ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 10,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              &quot;완료되지 않은 정산이 있습니다. 지난 정산을 확정 후 입력하세요&quot;
            </Typography>
          </Box>
        ) : (
          <SettlementForm
            mode="create"
            yesterdayTotal={state.yesterdayTotal}
            previousLockedBalance={state.lockedBalance}
            withdrawMemos={withdrawMemos}
          />
        )}
      </Container>
    </Box>
  );
}
