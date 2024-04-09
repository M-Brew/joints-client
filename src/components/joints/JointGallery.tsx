import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import ImageWithFallback from "../custom/ImageWithFallback";
import UploadImage from "../custom/UploadImage";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import ViewIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

export default function JointGallery(props: IGallery) {
  const { images, handleUpload, handleDelete } = props;

  const [uploading, setUploading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<{
    index: number | string;
    message: string;
  }>();

  return (
    <Grid container spacing={3}>
      {images.map((image) => (
        <Grid key={image._id} item xs={12} sm={6} md={4} lg={3}>
          <Box
            sx={{
              display: "block",
              position: "relative",
              height: "250px",
              "&:hover .options": {
                display: "flex",
              },
            }}
          >
            <ImageWithFallback
              alt="item-view"
              src={image.imageURL}
              sizes="(min-width: 1024px) 30vw, (min-width: 425px) 45vw, 100vw"
              style={{
                borderRadius: 4,
                objectFit: "fill",
              }}
              fallbackSrc="https://images.unsplash.com/photo-1541140134513-85a161dc4a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
            />
            <Box
              className="options"
              sx={{
                position: "absolute",
                top: 0,
                display: deleting === image._id ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                height: "250px",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {deleting === image._id ? (
                errorMessage?.index === image._id ? (
                  <Typography fontSize={12}>{errorMessage.message}</Typography>
                ) : (
                  <CircularProgress size={20} />
                )
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mb: 1 }}
                    endIcon={<ViewIcon />}
                    disabled={uploading || !!deleting}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<RemoveIcon />}
                    onClick={() => {
                      setDeleting(image._id);
                      handleDelete?.(image, (error) => {
                        if (error) {
                          setErrorMessage({
                            index: image._id,
                            message:
                              "An error occurred. Please try again later.",
                          });
                          setTimeout(() => {
                            setErrorMessage(undefined);
                            setDeleting(undefined);
                          }, 2000);
                        }
                      });
                    }}
                    disabled={uploading || !!deleting}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      ))}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "250px",
            width: "100%",
            backgroundColor: "whitesmoke",
            borderRadius: 4,
          }}
        >
          {uploading ? (
            <CircularProgress size={20} />
          ) : errorMessage?.index === "new" ? (
            <Typography fontSize={12}>{errorMessage.message}</Typography>
          ) : (
            <UploadImage
              handleUpload={({ file }) => {
                if (file) {
                  setUploading(true);
                  handleUpload?.(file, (error) => {
                    setUploading(false);
                    if (error) {
                      setErrorMessage({
                        index: "new",
                        message: "An error occurred. Please try again later.",
                      });
                      setTimeout(() => {
                        setErrorMessage(undefined);
                      }, 2000);
                    }
                  });
                }
              }}
            />
          )}
        </div>
      </Grid>
    </Grid>
  );
}

interface IGallery {
  images: { _id: string; key: string; imageURL: string }[];
  handleUpload?: (file: File, callback?: (error?: string) => void) => void;
  handleDelete?: (
    image: {
      _id: string;
      key: string;
      imageURL: string;
    },
    callback?: (error?: string) => void
  ) => void;
}
