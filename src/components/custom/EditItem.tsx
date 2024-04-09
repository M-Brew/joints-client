import React, { KeyboardEvent, MouseEvent, useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function EditItem(props: IEditItem) {
  const { name, value, multiline, add, handleUpdate } = props;
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const open = Boolean(anchorEl);

  const [item, setItem] = useState(value ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (value) {
      setItem(value);
    }
  }, [value]);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setLoading(false);
    setError(undefined);
    setItem(value ?? "")
    setAnchorEl(null);
  };

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setLoading(true);
      setTimeout(() => {
        handleUpdate?.(name ?? "", item, (error) => {
          if (error) {
            setError(error);
            setLoading(false);
          } else {
            handleClose();
          }
        });
      }, 2000);
    }
  };

  return (
    <Box>
      {add ? (
        <AddCircleOutlineIcon
          fontSize="small"
          color="secondary"
          sx={{ cursor: "pointer" }}
          onClick={handleClick}
        />
      ) : (
        <EditOutlinedIcon
          fontSize="small"
          color="secondary"
          sx={{ cursor: "pointer" }}
          onClick={handleClick}
        />
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Grid container spacing={2} px={2} py={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id={name ?? "item"}
              name={name ?? "item"}
              label={
                <span style={{ textTransform: "capitalize" }}>
                  {name ?? "item"}
                </span>
              }
              value={item}
              onChange={(e) => setItem(e.target.value)}
              size="small"
              onKeyDown={handleEnter}
              // onBlur={formik.handleBlur}
              // error={formik.touched.name && Boolean(formik.errors.name)}
              // helperText={formik.touched.name && formik.errors.name}
              error={!!error}
              helperText={error && error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <EditOutlinedIcon fontSize="small" />
                    )}
                  </InputAdornment>
                ),
              }}
              multiline={multiline}
            />
          </Grid>
        </Grid>
      </Menu>
    </Box>
  );
}

interface IEditItem {
  name?: string;
  value?: string;
  multiline?: boolean;
  add?: boolean;
  handleUpdate?: (
    name: string,
    value: string,
    callback?: (error?: string) => void
  ) => void;
}
