import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import SettingsTable from "@/components/settings/SettingsTable";

export default async function SettingPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  return (
    <Box>
      <Card variant="outlined" elevation={0}>
        <SettingsTable slug={slug} />
      </Card>
    </Box>
  );
}
