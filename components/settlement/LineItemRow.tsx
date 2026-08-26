"use client";

import type { KeyboardEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AmountField from "@/components/settlement/AmountField";

export default function LineItemRow({
  memo,
  amount,
  onMemoChange,
  onAmountChange,
  onSubmit,
  memoLabel = "내역",
  memoPlaceholder,
  memoOptions,
}: {
  memo: string;
  amount: number | undefined;
  onMemoChange: (value: string) => void;
  onAmountChange: (value: number | undefined) => void;
  onSubmit: () => void;
  memoLabel?: string;
  memoPlaceholder?: string;
  memoOptions?: string[];
}) {
  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(0, 1fr) 200px 96px",
        },
        gap: 1.25,
        alignItems: "stretch",
      }}
    >
      {memoOptions ? (
        <Autocomplete
          freeSolo
          options={memoOptions}
          value={memo}
          onInputChange={(_event, value) => onMemoChange(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={memoLabel}
              placeholder={memoPlaceholder}
              onKeyDown={handleEnter}
            />
          )}
        />
      ) : (
        <TextField
          value={memo}
          label={memoLabel}
          placeholder={memoPlaceholder}
          variant="outlined"
          onChange={(event) => onMemoChange(event.target.value)}
          onKeyDown={handleEnter}
        />
      )}
      <AmountField
        value={amount}
        onValueChange={onAmountChange}
        onEnter={onSubmit}
        sx={{ width: "100%" }}
      />
      <Button
        variant="contained"
        onClick={onSubmit}
        sx={{
          minHeight: { xs: 48, sm: 56 },
          px: 2,
          fontWeight: 700,
        }}
      >
        입력
      </Button>
    </Box>
  );
}
