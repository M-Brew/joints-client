import React, { useContext } from "react";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import navItems from "@/data/settings-data.json";
import { SettingsContext } from "@/contexts/settings-context";

export default function SettingsDrawer(props: ISettingsDrawer) {
  const { slug, handleSetSlug } = useContext(SettingsContext);
  const { open, handleOpenDrawer } = props;

  return (
    <Drawer anchor={"left"} open={open} onClose={() => handleOpenDrawer(false)}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => handleOpenDrawer(false)}
        onKeyDown={() => handleOpenDrawer(false)}
      >
        <List component="nav">
          {navItems.map((navItem) => (
            <ListItem key={navItem.slug} sx={{ paddingX: 1, paddingY: 0.5 }}>
              <ListItemButton
                sx={{ borderRadius: 2 }}
                onClick={() => handleSetSlug(navItem.slug)}
                selected={slug === navItem.slug}
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

interface ISettingsDrawer {
  open: boolean;
  handleOpenDrawer: (value: boolean) => void;
}
