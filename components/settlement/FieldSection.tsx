"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SectionTone } from "@/lib/sectionColors";

export default function FieldSection({
  title,
  hint,
  children,
  tone,
}: {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
  tone?: SectionTone;
}) {
  return (
    <Box
      sx={{
        py: 1.25,
        px: { xs: 1.25, sm: 1.5 },
        mb: 1,
        borderRadius: 1.5,
        bgcolor: tone?.bg ?? "transparent",
        border: "1px solid",
        borderColor: tone?.border ?? "divider",
        borderLeft: tone ? `4px solid ${tone.main}` : "1px solid",
        "&:last-of-type": { mb: 0 },
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: 14,
          color: tone?.main,
          mb: hint ? 0.4 : 1,
        }}
      >
        {title}
      </Typography>
      {hint ? (
        <Typography
          sx={{ fontSize: 12, lineHeight: 1.45, mb: 1, color: "text.secondary" }}
        >
          {hint}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}
