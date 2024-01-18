import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { alpha, useTheme } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import ThemeModeToggler from "@components/theme-mode-toggler";
interface Props {
  colorInvert?: boolean;
}

const Topbar = ({ colorInvert = false }: Props): JSX.Element => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const router = useRouter();

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={1}
      py={1}
    >
      <Box
        display={"flex"}
        component="a"
        href="/"
        title="team lx"
        width={{ xs: 100, md: 120 }}
      >
        {/* <Box
          component={"img"}
          src={
            mode === "light" && !colorInvert
              ? "/images/logo/light.png"
              : "/images/logo/dark.png"
          }
          height={1}
          width={1}
        /> */}
        teamlx
      </Box>

      <Box sx={{ display: "flex" }} alignItems={"center"}>
        <Box display={router.pathname === "/" ? "flex" : "none"}>
          <SearchIcon fontSize="small" />
        </Box>
        <Box marginLeft={2}>
          <ThemeModeToggler />
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
