import React from "react";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const navItems: { title: string; link: string }[] = [
  {
    title: "Dashboard",
    link: "",
  },
  {
    title: "Settings",
    link: "/settings/meal-types",
  },
];

export default function DashboardDrawer(props: IDashboardDrawer) {
  const { open, handleClose } = props;
  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Drawer
      variant={matches ? "persistent" : "temporary"}
      anchor={"left"}
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
        role="presentation"
        onClick={matches ? () => {} : handleClose}
        onKeyDown={matches ? () => {} : handleClose}
      >
        <Box
          sx={{
            paddingX: 3,
            paddingY: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Joints</Typography>
          <ChevronLeftIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
        </Box>
        <Divider />
        <List component="nav">
          {navItems.map((navItem, idx) => (
            <ListItem key={idx} sx={{ paddingX: 1, paddingY: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(`/admin/dashboard${navItem.link}`)}
                selected={
                  navItem.title === "Settings"
                    ? pathname.includes("settings")
                    : pathname === `/admin/dashboard${navItem.link}`
                }
              >
                <ListItemText
                  primary={
                    <Typography fontSize={14}>{navItem.title}</Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

interface IDashboardDrawer {
  open: boolean;
  handleClose: () => void;
}
