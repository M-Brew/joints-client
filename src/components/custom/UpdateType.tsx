import React, { KeyboardEvent, MouseEvent, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { getSettingItems } from "@/app/api/settings";

export default function UpdateType(props: IUpdateType) {
  const { currentTypes, handleUpdateType } = props;
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const open = Boolean(anchorEl);

  const [jointTypes, setJointTypes] = useState<ISettingItem[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const response = await getSettingItems("joint-types");
        if (response?.status === 200) {
          const currentTypeNames = currentTypes.map((type) => type.name);
          const types = (response.data as ISettingItem[]).filter(
            (item) => !currentTypeNames.includes(item.name)
          );
          setJointTypes(types);
        }
      } catch (error) {
        console.log({ error });
      }
    })();
  }, [currentTypes]);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setLoading(false);
    setError(undefined);
    setSelectedTypes([]);
    setAnchorEl(null);
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;

    setSelectedTypes(typeof value === "string" ? value.split(",") : value);
  };

  const handleUpdate = () => {
    handleUpdateType(selectedTypes);
    setLoading(true);
    handleUpdateType(selectedTypes, (error) => {
      if (error) {
        setError("An error occurred. Please try again later.");
        setTimeout(() => {
          setError(undefined);
          setLoading(false);
        }, 2000);
      } else {
        handleClose();
      }
    });
  };

  return (
    <Box>
      <AddCircleOutlineIcon
        color="secondary"
        sx={{ cursor: "pointer", mt: 1 }}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Grid container spacing={2} px={2} py={1}>
          <Grid item xs={12} display="flex" alignItems="center">
            <FormControl fullWidth sx={{ width: "250px" }}>
              <InputLabel id="joint-type-label" size="small">
                Type
              </InputLabel>
              <Select
                labelId="joint-type-label"
                id="joint-type"
                name="type"
                multiple
                value={selectedTypes}
                onChange={handleChange}
                input={<OutlinedInput label="Type" size="small" />}
                size="small"
                error={Boolean(error)}
              >
                {jointTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                fontSize={12}
                sx={{ color: "#d32f2f", ml: 1, mt: 0.5 }}
              >
                {error}
              </Typography>
            </FormControl>
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 1 }}
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="secondary" />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>
        </Grid>
      </Menu>
    </Box>
  );
}

interface IUpdateType {
  currentTypes: {
    _id: string;
    name: string;
  }[];
  handleUpdateType: (
    types: string[],
    callback?: (error?: string) => void
  ) => void;
}
