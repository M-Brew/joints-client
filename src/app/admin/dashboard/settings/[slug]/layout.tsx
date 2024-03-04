"use client";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import SettingsNav from "@/components/settings/SettingsNav";

export default function SettingsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string };
}>) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Container sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {matches && (
          <Grid item xs={3}>
            <SettingsNav slug={params.slug} />
          </Grid>
        )}
        <Grid item xs={matches ? 9 : 12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
}
