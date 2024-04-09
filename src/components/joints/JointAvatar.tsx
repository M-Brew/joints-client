import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import RemoveIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

import ImageWithFallback from "../custom/ImageWithFallback";
import UploadImage from "../custom/UploadImage";
import { CircularProgress } from "@mui/material";

export default function JointAvatar(props: IJointAvatar) {
  const { avatar, handleUploadAvatar, handleDeleteAvatar } = props;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  return (
    <Box>
      <Box
        sx={{
          display: "block",
          position: "relative",
          height: "250px",
        }}
      >
        {avatar ? (
          <ImageWithFallback
            alt="item-view"
            src={avatar.imageURL}
            sizes="(min-width: 1024px) 30vw, (min-width: 425px) 45vw, 100vw"
            style={{
              borderRadius: 4,
              objectFit: "cover",
            }}
            fallbackSrc="https://images.unsplash.com/photo-1541140134513-85a161dc4a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "whitesmoke",
              borderRadius: 4,
            }}
          />
        )}
      </Box>
      {errorMessage ? (
        <Typography fontSize={12} textAlign="center" color="#d32f2f" my={2}>
          {errorMessage}
        </Typography>
      ) : loading ? (
        <Box textAlign="center" my={2}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        <Box my={2} textAlign="center">
          {avatar ? (
            <Button
              variant="outlined"
              tabIndex={-1}
              startIcon={<RemoveIcon />}
              size="small"
              onClick={() => {
                setLoading(true);
                handleDeleteAvatar?.(() => {
                  setLoading(false);
                });
              }}
            >
              <Typography>Delete Avatar</Typography>
            </Button>
          ) : (
            <UploadImage
              title="Upload Avatar"
              handleUpload={({ file }) => {
                if (file) {
                  setLoading(true);
                  handleUploadAvatar?.(file, (error) => {
                    setLoading(false);
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
        </Box>
      )}
    </Box>
  );
}

interface IJointAvatar {
  avatar?: { _id: string; key: string; imageURL: string };
  handleUploadAvatar?: (
    file: File,
    callback?: (error?: string) => void
  ) => void;
  handleDeleteAvatar?: (callback?: () => void) => void;
}
