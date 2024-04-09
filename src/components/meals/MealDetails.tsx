import React, { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

import RemoveIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

import ImageWithFallback from "../custom/ImageWithFallback";
import UploadImage from "../custom/UploadImage";

export default function MealDetails(props: IMealDetails) {
  const { meal, handleUpload, handleDelete } = props;

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {!meal.image ? (
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
              ) : errorMessage ? (
                <Typography fontSize={12}>{errorMessage}</Typography>
              ) : (
                <UploadImage
                  handleUpload={({ file }) => {
                    if (file) {
                      setUploading(true);
                      handleUpload?.(file, (error) => {
                        setUploading(false);
                        if (error) {
                          setErrorMessage(
                            "An error occurred. Please try again later."
                          );
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
          ) : (
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
                alt="meal-image"
                src={meal.image.imageURL}
                sizes="(min-width: 1024px) 30vw, (min-width: 425px) 45vw, 100vw"
                style={{
                  borderRadius: 5,
                  objectFit: "cover",
                }}
                fallbackSrc="https://images.unsplash.com/photo-1541140134513-85a161dc4a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
              />
              <Box
                className="options"
                sx={{
                  position: "absolute",
                  top: 0,
                  display: deleting ? "flex" : "none",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "250px",
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                {deleting ? (
                  errorMessage ? (
                    <Typography fontSize={12}>{errorMessage}</Typography>
                  ) : (
                    <CircularProgress size={20} />
                  )
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<RemoveIcon />}
                      onClick={() => {
                        setDeleting(true);
                        handleDelete?.((error) => {
                          if (error) {
                            setErrorMessage(
                              "An error occurred. Please try again later."
                            );
                            setTimeout(() => {
                              setErrorMessage(undefined);
                              setDeleting(false);
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
          )}
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography>
                  <span style={{ opacity: 0.5 }}>Name</span>:{" "}
                  <span>{meal.name}</span>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <span style={{ opacity: 0.5 }}>Description</span>:{" "}
                  <span>{meal.description}</span>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <span style={{ opacity: 0.5 }}>Price</span>:{" "}
                  <span>
                    {meal.currency === "cedi" ? "GHC" : ""}{" "}
                    {meal.price.toFixed(2)}
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

interface IMealDetails {
  meal: IMealData;
  handleUpload?: (file: File, callback: (error?: string) => void) => void;
  handleDelete?: (callback: (error?: string) => void) => void;
}
