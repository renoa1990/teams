"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function FieldSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        py: 2.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-of-type": { borderBottom: 0 },
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: hint ? 0.75 : 1.5 }}>
        {title}
      </Typography>
      {hint ? (
        <Typography
          color="text.secondary"
          sx={{ fontSize: 13, lineHeight: 1.6, mb: 1.5 }}
        >
          {hint}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}
