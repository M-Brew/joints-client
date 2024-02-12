"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import SettingsNav from "@/components/settings/SettingsNav";
import SettingsContextProvider from "@/contexts/settings-context";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <SettingsContextProvider>
      <Container sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {matches && (
            <Grid item xs={3}>
              <SettingsNav />
            </Grid>
          )}
          <Grid item xs={matches ? 9 : 12}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </SettingsContextProvider>
  );
}
