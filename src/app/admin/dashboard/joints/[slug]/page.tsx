import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import JointDetails from "@/components/joints/JointDetails";

export default function JointPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <Box>
      <Card variant="outlined" elevation={0}>
        <JointDetails slug={slug} />
      </Card>
    </Box>
  );
}
