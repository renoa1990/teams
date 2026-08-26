import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";

const rgb = "#8c98a4";

const shadows = [
  "none",
  `0 3px 6px 0 ${alpha(rgb, 0.25)}`,
  `0 12px 15px ${alpha(rgb, 0.1)}`,
  `0 6px 24px 0 ${alpha(rgb, 0.125)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
  `0 10px 40px 10px ${alpha(rgb, 0.175)}`,
] as const;

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#377dff",
        light: "#467de3",
        dark: "#2f6ad9",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ffb74d",
        main: "#f9b934",
        dark: "#FF9800",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      text: {
        primary: "#1e2022",
        secondary: "#677788",
      },
      divider: "rgba(0, 0, 0, 0.12)",
      background: {
        paper: "#ffffff",
        default: "#ffffff",
      },
    },
    shadows: shadows as unknown as Shadows,
    typography: {
      fontFamily: '"Inter", sans-serif',
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },
    zIndex: {
      appBar: 1200,
      drawer: 1300,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 400,
            borderRadius: 5,
            paddingTop: 10,
            paddingBottom: 10,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 5,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 5,
          },
          input: {
            borderRadius: 5,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  }),
);

export default theme;
