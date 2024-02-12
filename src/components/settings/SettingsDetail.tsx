import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function SettingsDetail(props: ISettingsDetails) {
  const { settingItem } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  if (!settingItem) {
    return <></>;
  }

  return (
    <Container>
      <Box display={matches ? "block" : "flex"} mb={1}>
        <Typography fontWeight="bold" mr={1}>
          Name:
        </Typography>
        <Typography>{settingItem.name}</Typography>
      </Box>
      <Box display={matches ? "block" : "flex"} mb={1}>
        <Typography fontWeight="bold" mr={1}>
          Description:
        </Typography>
        <Typography>{settingItem.description}</Typography>
      </Box>
      <Box display={matches ? "block" : "flex"} mb={1}>
        <Typography fontWeight="bold" mr={1}>
          Created By:
        </Typography>
        <Typography>{settingItem.createdBy}</Typography>
      </Box>
      <Box display={matches ? "block" : "flex"} mb={1}>
        <Typography fontWeight="bold" mr={1}>
          Created At:
        </Typography>
        <Typography>
          {new Date(settingItem.createdAt).toLocaleDateString("en-uk", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Box>
      <Box display={matches ? "block" : "flex"} mb={1}>
        <Typography fontWeight="bold" mr={1}>
          Last Updated:
        </Typography>
        <Typography>
          {new Date(settingItem.updatedAt).toLocaleDateString("en-uk", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Box>
    </Container>
  );
}

interface ISettingsDetails {
  settingItem?: ISettingItem;
}
