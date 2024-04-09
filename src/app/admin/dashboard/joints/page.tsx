import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import JointsTable from "@/components/joints/JointsTable";

export default async function Joints() {
  return (
    <Box>
      <Card variant="outlined" elevation={0}>
        <JointsTable />
      </Card>
    </Box>
  );
}
