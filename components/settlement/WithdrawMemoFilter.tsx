"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function WithdrawMemoFilter({
  memos,
  value,
}: {
  memos: string[];
  value: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const apply = (memo: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (memo) {
      params.set("withdrawMemo", memo);
    } else {
      params.delete("withdrawMemo");
    }
    params.set("page", "0");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mt: 4,
        mb: 1,
      }}
    >
      <Autocomplete
        options={memos}
        value={value || null}
        onChange={(_event, next) => apply(next ?? "")}
        sx={{ width: { xs: "100%", sm: 360 } }}
        renderInput={(params) => (
          <TextField {...params} label="지출내역 검색" placeholder="전체" />
        )}
      />
      {value ? (
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          &quot;{value}&quot; 가 포함된 정산만 표시합니다.
        </Typography>
      ) : null}
    </Box>
  );
}
