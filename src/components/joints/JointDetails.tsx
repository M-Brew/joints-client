"use client";

import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationONOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import {
  deleteAvatar,
  deleteGalleryImage,
  getJoint,
  updateAvatar,
  updateJoint,
  uploadGalleryImage,
} from "@/app/api/joints";

import { createMenu, getJointMenus } from "@/app/api/menus";

import EditItem from "../custom/EditItem";
import JointGallery from "./JointGallery";
import JointAvatar from "./JointAvatar";
import UpdateType from "../custom/UpdateType";
import MenuForm from "../menu/MenuForm";

export default function JointDetails(props: { slug: string }) {
  const { slug } = props;
  const router = useRouter();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const [data, setData] = useState<IJoint>();
  const [menus, setMenus] = useState<IMenuData[]>();
  const [deletingType, setDeletingType] = useState<string>();
  const [openMenuForm, setOpenMenuForm] = useState(false);

  const handleGetJoint = async (slug: string) => {
    try {
      const response = await getJoint(slug);
      if (response?.status === 200) {
        const joint = response.data as IJoint;
        setData(joint);
        const response2 = await getJointMenus(joint._id);
        if (response2?.status === 200) {
          const menuData = response2.data as IMenuData[];
          setMenus(menuData);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    handleGetJoint(slug);
  }, [slug]);

  const handleUpdate = async (
    name: string,
    value: string,
    callback?: (error?: string) => void
  ) => {
    try {
      const response = await updateJoint(data?._id ?? slug, {
        [name]: name === "phone" ? [...(data?.phone ?? []), value] : value,
      });
      if (response?.status === 200) {
        setData(response.data);
        callback?.();
        if (name === "name") {
          router.push(`/admin/dashboard/joints/${response.data.slug}`);
        }
      }
    } catch (error) {
      console.log({ error });
      callback?.("An error occurred. Please try again later.");
    }
  };

  const handleUpdateType = async (
    types: string[],
    callback?: (error?: string) => void
  ) => {
    try {
      const response = await updateJoint(data?._id ?? slug, {
        type: [...(data?.type.map((t) => t._id) ?? []), ...types],
      });
      if (response?.status === 200) {
        setData(response.data);
        callback?.();
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log({ error });
      callback?.("error");
    }
  };

  const handleDeleteType = async (type: { _id: string; name: string }) => {
    try {
      setDeletingType(type._id);
      const updated = data?.type
        .filter((t) => t._id !== type._id)
        .map((item) => item._id);
      const response = await updateJoint(data?._id ?? slug, {
        type: updated,
      });
      if (response?.status === 200) {
        setData(response.data);
        setDeletingType(undefined);
      } else {
        setDeletingType(undefined);
      }
    } catch (error) {
      console.log({ error });
      setDeletingType(undefined);
    }
  };

  const handleDeletePhone = async (phone: string) => {
    try {
      const updatedPhones = data?.phone.filter((p) => p !== phone);
      const response = await updateJoint(data?._id ?? slug, {
        phone: updatedPhones,
      });
      if (response?.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleUploadAvatar = async (
    file?: File,
    callback?: (error?: string) => void
  ) => {
    try {
      const response = await updateAvatar(data?._id ?? "", file!);
      if (response?.status === 200) {
        setData(response.data);
        callback?.();
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log(error);
      callback?.("error");
    }
  };

  const handleDeleteAvatar = async (callback?: (error?: string) => void) => {
    try {
      const response = await deleteAvatar(data?._id ?? "");
      if (response?.status === 200) {
        setData((prev) => ({ ...prev, avatar: undefined } as IJoint));
        callback?.();
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log("error");
      callback?.();
    }
  };

  const handleUploadGalleryImage = async (
    file: File,
    callback?: (error?: string) => void
  ) => {
    try {
      const response = await uploadGalleryImage(data?._id ?? "", file);
      if (response?.status === 200) {
        setData(response.data);
        callback?.();
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log(error);
      callback?.("error");
    }
  };

  const handleDeleteGalleryImage = async (
    image: { _id: string; key: string; imageURL: string },
    callback?: (error?: string) => void
  ) => {
    try {
      const response = await deleteGalleryImage(data?._id ?? "", image.key);
      if (response?.status === 200) {
        setData(response.data);
        callback?.();
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log(error);
      callback?.("error");
    }
  };

  const handleCloseMenuForm = () => {
    setOpenMenuForm(false);
  };

  const handleCreateMenu = async (
    values: { menuType: string },
    callback?: (error?: string) => void
  ) => {
    try {
      const response = await createMenu({
        menuType: values.menuType,
        joint: data!._id,
      });
      if (response?.status === 201) {
        handleGetJoint(slug);
        callback?.();
        handleCloseMenuForm();
      } else if (response?.status === 400) {
        callback?.(response.data.error);
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log(error);
      callback?.("error");
    }
  };

  const handleOpenMenu = (menuId: string) => {
    router.push(`/admin/dashboard/joints/${slug}/menu/${menuId}`);
  };

  if (!data) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box padding={3} sx={{ minHeight: "80vh" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ArrowBackIosIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/admin/dashboard/joints")}
            />
          </Grid>
          <Grid item container xs={12} columnSpacing={6}>
            <Grid item xs={12} sm={5}>
              <JointAvatar
                avatar={data.avatar}
                handleUploadAvatar={handleUploadAvatar}
                handleDeleteAvatar={handleDeleteAvatar}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Box mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <Typography fontSize={30} fontWeight="bold" mr={1}>
                  {data.name}
                </Typography>
                <Tooltip
                  title={data.verified ? "Verified" : "Not Verified"}
                  placement="right"
                  sx={{ mr: 1 }}
                >
                  <CheckCircleIcon
                    color={data.verified ? "success" : "disabled"}
                  />
                </Tooltip>
                <EditItem
                  name="name"
                  value={data.name}
                  handleUpdate={handleUpdate}
                />
              </Box>
              <Box
                mb={1.2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {data.type.map((t) => (
                  <Box
                    key={t._id}
                    sx={{
                      display: "block",
                      position: "relative",
                      mr: 1.5,
                      mt: 1,
                    }}
                  >
                    <Chip
                      variant="outlined"
                      label={<Typography fontSize={14}>{t.name}</Typography>}
                    />
                    {data.type.length > 1 ? (
                      deletingType === t._id ? (
                        <CircularProgress
                          size={15}
                          color="secondary"
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: -5,
                            right: -10,
                          }}
                        />
                      ) : (
                        <CancelIcon
                          fontSize="small"
                          color="secondary"
                          sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: -5,
                            right: -10,
                          }}
                          onClick={() => handleDeleteType(t)}
                        />
                      )
                    ) : (
                      <></>
                    )}
                  </Box>
                ))}
                <UpdateType
                  currentTypes={data.type}
                  handleUpdateType={handleUpdateType}
                />
              </Box>
              <Box mb={1.2} sx={{ display: "flex", alignItems: "center" }}>
                <DescriptionOutlinedIcon sx={{ mr: 1.5 }} fontSize="small" />
                <Typography mr={1.5}>{data.description}</Typography>
                <EditItem
                  name="description"
                  value={data.description}
                  handleUpdate={handleUpdate}
                />
              </Box>
              <Box mb={1.2} sx={{ display: "flex", alignItems: "center" }}>
                <LocationOnOutlinedIcon sx={{ mr: 1.5 }} fontSize="small" />
                <Typography mr={1.5}>{data.address}</Typography>
                <EditItem
                  name="address"
                  value={data.address}
                  handleUpdate={handleUpdate}
                />
              </Box>
              <Box mb={1.2} sx={{ display: "flex", alignItems: "center" }}>
                <PhoneOutlinedIcon
                  sx={{ mr: 1.5, alignSelf: "flex-start" }}
                  fontSize="small"
                />
                <Box>
                  {data.phone.map((number, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography mr={1.5}>{number}</Typography>
                      <CancelOutlinedIcon
                        fontSize="small"
                        color="secondary"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDeletePhone(number)}
                      />
                    </Box>
                  ))}
                  <EditItem
                    add
                    name="phone"
                    value={""}
                    handleUpdate={handleUpdate}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <hr style={{ border: "0.5px solid whitesmoke" }} />
          </Grid>
          <Grid item xs={12} container spacing={3}>
            <Grid item xs={12}>
              <Typography fontWeight="bold">Gallery</Typography>
            </Grid>
            <Grid item xs={12}>
              <JointGallery
                images={data.gallery}
                handleUpload={handleUploadGalleryImage}
                handleDelete={handleDeleteGalleryImage}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <hr style={{ border: "0.5px solid whitesmoke" }} />
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12}>
              <Typography fontWeight="bold">Menu</Typography>
            </Grid>
            {menus && (
              <Grid item xs={12}>
                {menus.map((menu) => (
                  <Card
                    key={menu._id}
                    elevation={1}
                    sx={{ p: 2, mb: 2, cursor: "pointer" }}
                    onClick={() => handleOpenMenu(menu._id)}
                  >
                    {menu.menuType.name}
                  </Card>
                ))}
              </Grid>
            )}
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenMenuForm(true)}
              >
                <Typography>Add New Menu</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Modal open={openMenuForm} onClose={handleCloseMenuForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "90%",
            width: matches ? 700 : "80%",
            overflow: "scroll",
            bgcolor: "background.paper",
            borderRadius: "5px",
            p: matches ? 4 : 2,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={18}>New Menu</Typography>
            <CloseIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={handleCloseMenuForm}
            />
          </Box>
          <MenuForm handleSubmit={handleCreateMenu} />
          {/* {success && (
            <Alert severity="success" icon={false}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" icon={false}>
              {error}
            </Alert>
          )} */}
        </Box>
      </Modal>
    </>
  );
}
