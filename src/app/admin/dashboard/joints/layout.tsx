"use client";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

export default function JointsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { slug: string };
}>) {
  return (
    <Container sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
}
