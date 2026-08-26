"use client";

import type { KeyboardEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AmountField from "@/components/settlement/AmountField";
import type { SectionTone } from "@/lib/sectionColors";

function accentFieldSx(tone?: SectionTone) {
  if (!tone) return undefined;
  return {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: tone.main,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: tone.main,
    },
  };
}

export default function LineItemRow({
  memo,
  amount,
  onMemoChange,
  onAmountChange,
  onSubmit,
  memoLabel = "내역",
  memoPlaceholder,
  memoOptions,
  tone,
}: {
  memo: string;
  amount: number | undefined;
  onMemoChange: (value: string) => void;
  onAmountChange: (value: number | undefined) => void;
  onSubmit: () => void;
  memoLabel?: string;
  memoPlaceholder?: string;
  memoOptions?: string[];
  tone?: SectionTone;
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
          xs: "minmax(0, 1fr) 72px",
          sm: "minmax(0, 168px) 148px 64px",
        },
        gap: 1,
        alignItems: "stretch",
        maxWidth: 400,
      }}
    >
      {memoOptions ? (
        <Autocomplete
          freeSolo
          size="small"
          options={memoOptions}
          value={memo}
          onInputChange={(_event, value) => onMemoChange(value)}
          sx={{ gridColumn: { xs: "1 / -1", sm: "auto" } }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label={memoLabel}
              placeholder={memoPlaceholder}
              onKeyDown={handleEnter}
              sx={accentFieldSx(tone)}
            />
          )}
        />
      ) : (
        <TextField
          size="small"
          value={memo}
          label={memoLabel}
          placeholder={memoPlaceholder}
          variant="outlined"
          onChange={(event) => onMemoChange(event.target.value)}
          onKeyDown={handleEnter}
          sx={{
            gridColumn: { xs: "1 / -1", sm: "auto" },
            ...accentFieldSx(tone),
          }}
        />
      )}
      <AmountField
        value={amount}
        onValueChange={onAmountChange}
        onEnter={onSubmit}
        sx={{ width: "100%", ...accentFieldSx(tone) }}
      />
      <Button
        size="small"
        variant="contained"
        onClick={onSubmit}
        sx={{
          minHeight: 40,
          minWidth: 0,
          px: 1,
          fontWeight: 700,
          fontSize: 13,
          bgcolor: tone?.main,
          "&:hover": {
            bgcolor: tone?.main,
            filter: "brightness(0.92)",
          },
        }}
      >
        입력
      </Button>
    </Box>
  );
}
