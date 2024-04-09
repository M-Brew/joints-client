import React from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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

export default function UploadImage(props: IUploadImage) {
  const { title, multiple, handleUpload } = props;

  return (
    <Button
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      size="small"
    >
      <Typography fontSize={14}>{title ?? "Upload Image"}</Typography>
      <VisuallyHiddenInput
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            if (multiple) {
              handleUpload?.({ files: e.target.files });
            } else {
              handleUpload?.({ file: e.target.files[0] })
            }
          }
        }}
      />
    </Button>
  );
}

interface IUploadImage {
  title?: string;
  multiple?: boolean;
  handleUpload?: (props: {file?: File; files?: FileList}) => void;
}
