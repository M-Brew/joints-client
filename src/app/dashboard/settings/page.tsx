import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import SettingsTable from "@/components/settings/SettingsTable";

export default function Settings() {
  return (
    <Box>
      <Card variant="outlined" elevation={0}>
        <SettingsTable />
      </Card>
    </Box>
  );
}
