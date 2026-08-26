"use client";

import type { KeyboardEvent } from "react";
import TextField from "@mui/material/TextField";
import { NumericFormat } from "react-number-format";
import type { SxProps, Theme } from "@mui/material/styles";

export default function AmountField({
  value,
  onValueChange,
  onEnter,
  label = "금액",
  sx,
}: {
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
  onEnter?: () => void;
  label?: string;
  sx?: SxProps<Theme>;
}) {
  return (
    <NumericFormat
      customInput={TextField}
      thousandSeparator
      variant="outlined"
      value={value ?? ""}
      label={label}
      onValueChange={(values) => {
        onValueChange(values.floatValue);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onEnter?.();
        }
      }}
      slotProps={{
        htmlInput: {
          maxLength: 15,
          style: { textAlign: "right", fontWeight: 600 },
        },
      }}
      size="small"
      sx={sx}
    />
  );
}
