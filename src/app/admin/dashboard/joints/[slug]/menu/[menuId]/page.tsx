"use client";

import React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import Menu from "@/components/menu/Menu";
import MenuTable from "@/components/menu/MenuTable";

export default function MenuPage({
  params,
}: {
  params: { slug: string; menuId: string };
}) {
  const { slug, menuId } = params;

  return (
    <Box>
      <Card variant="outlined" elevation={0}>
        <MenuTable slug={slug} menuId={menuId} />
        {/* <Menu slug={slug} menuId={menuId} /> */}
      </Card>
    </Box>
  );
}
