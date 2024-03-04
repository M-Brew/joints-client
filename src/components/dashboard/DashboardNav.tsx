"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardDrawer from "./DashboardDrawer";
import { signOut } from "@/app/api/auth";

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

export default function DashboardNav(props: IDashboardNav) {
  const { children } = props;
  const router = useRouter();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const [open, setOpen] = useState(false);

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

  const handleSignOut = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const response = await signOut(refreshToken);
      if (response.status === 204) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.replace("/admin");
      }
    }
  };

  return (
    <>
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
              <Typography
                variant="h6"
                sx={{ display: open ? "none" : "block" }}
              >
                Joints
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={handleSignOut}
              >
                Logout
              </Typography>
            </Box>
          </Toolbar>
        </TopBar>
        <Box
          sx={{
            marginTop: "64px",
            ml: matches ? (open ? "250px" : 0) : 0,
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#f3f6f999",
          }}
        >
          {children}
        </Box>
      </Box>
      <DashboardDrawer open={open} handleClose={handleClose} />
    </>
  );
}

interface IDashboardNav {
  children: React.ReactNode;
}
