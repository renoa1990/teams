"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        px: 2,
      }}
    >
      <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
        처리 중 문제가 발생했습니다
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: 14 }}>
        잠시 후 다시 시도해 주세요.
      </Typography>
      <Button variant="contained" onClick={reset} sx={{ fontWeight: 700 }}>
        다시 시도
      </Button>
    </Box>
  );
}
