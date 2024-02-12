"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface TopBarProps extends AppBarProps {
  open?: boolean;
}

const TopBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<TopBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${250}px)`,
    marginLeft: `${250}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const navItems: { title: string; link: string }[] = [
  {
    title: "Dashboard",
    link: "",
  },
  {
    title: "Settings",
    link: "/settings",
  },
];

export default function DashboardNav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (matches) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [matches]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <CssBaseline />
      <TopBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: open ? "none" : "block" }}
            onClick={handleOpen}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ display: open ? "none" : "block" }}>
              Joints
            </Typography>
          </Box>
          <Box>
            <Typography>Logout</Typography>
          </Box>
        </Toolbar>
      </TopBar>
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
        variant={matches ? "persistent" : "temporary"}
        role="presentation"
        anchor={"left"}
        open={open}
        onClose={handleClose}
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
                onClick={() => router.push(`/dashboard${navItem.link}`)}
                selected={pathname === `/dashboard${navItem.link}`}
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
      </Drawer>
      <Box
        sx={{
          marginTop: "64px",
          ml: matches ? open ? "250px" : 0 : 0,
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f3f6f999",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
