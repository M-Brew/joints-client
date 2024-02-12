import { useContext } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import navItems from "@/data/settings-data.json";
import { SettingsContext } from "@/contexts/settings-context";

export default function SettingsNav() {
  const { slug, handleSetSlug } = useContext(SettingsContext);

  return (
    <Box>
      <Card variant="outlined" elevation={0}>
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
      </Card>
    </Box>
  );
}
