"use client";

import { Nunito } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { grey } from '@mui/material/colors';

const nunito = Nunito({
  weight: ["200", "400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: nunito.style.fontFamily,
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[400],
    },
  },
});

export default theme;
