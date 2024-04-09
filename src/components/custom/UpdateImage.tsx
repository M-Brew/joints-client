import React, { MouseEvent, useState } from "react";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UpdateImage(props: IUpdateImage) {
  const { image, handleUpdateAvatar, handleDeleteAvatar } = props;
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const open = Boolean(anchorEl);

  const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState<string>();
  // const [error, setError] = useState<string>();
  const [file, setFile] = useState<File>();

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteAvi = async () => {
    try {
      setLoading(true);

      handleDeleteAvatar?.(() => {
        setLoading(false);
        handleClose();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Box>
      {image ? (
        <CancelOutlinedIcon
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
        <Grid container spacing={2} px={1}>
          <Grid item xs={12}>
            {image ? (
              <Button variant="outlined" onClick={handleDeleteAvi}>
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Typography>Delete Avatar</Typography>
                )}
              </Button>
            ) : (
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                <Typography>Upload Avatar</Typography>
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => {
                    handleUpdateAvatar?.(e.target.files?.[0], () => {
                      handleClose();
                    });
                  }}
                />
              </Button>
            )}
            {/* <TextField
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
            /> */}
          </Grid>
        </Grid>
      </Menu>
    </Box>
  );
}

interface IUpdateImage {
  id: string;
  image?: {
    _id: string;
    key: string;
    imageURL: string;
  };
  handleUpdateAvatar?: (file?: File, callback?: () => void) => void;
  handleDeleteAvatar?: (callback?: () => void) => void;
}
