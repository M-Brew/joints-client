import React, { MouseEvent, useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Container from "@mui/material/Container";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import MealForm from "../meals/MealForm";

import { getMenu } from "@/app/api/menus";
import {
  addMeal,
  deleteMeal,
  deleteMealImage,
  updateMeal,
  uploadMealImage,
} from "@/app/api/meals";
import { getSettingItems } from "@/app/api/settings";
import MealDetails from "../meals/MealDetails";

export default function MenuTable(props: IMenuTable) {
  const { slug, menuId } = props;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const router = useRouter();

  const [menu, setMenu] = useState<IMenuData>();
  const [mealTypes, setMealTypes] = useState<ISettingItem[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<IMealData>();
  const [openMealForm, setOpenMealForm] = useState(false);
  const [openMealDetails, setOpenMealDetails] = useState(false);
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const response = await getMenu(menuId);
        if (response?.status === 200) {
          setMenu(response.data as IMenuData);
        }
      } catch (error) {
        console.log({ error });
      }
    })();
  }, [menuId]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getSettingItems("meal-types");
        if (response?.status === 200) {
          setMealTypes(response.data ?? []);
        }
      } catch (error) {
        console.log({ error });
      }
    })();
  }, []);

  const handleOpenMealForm = () => {
    setOpenMealForm(true);
  };

  const handleCloseMealForm = () => {
    setOpenMealForm(false);
  };

  const handleOpenMealDetails = (meal: IMealData) => {
    setSelectedMeal(meal);
    setOpenMealDetails(true);
  };

  const handleCloseMealDetails = () => {
    setOpenMealDetails(false);
    setSelectedMeal(undefined);
  };

  const handleAddMeal = async (meal: IMealFormValues) => {
    try {
      setError(undefined);

      const response = await addMeal({ ...meal, menu: menuId });
      if (response?.status === 201) {
        const responseData = response.data as IMealData;
        setMenu((prev) => {
          if (prev) {
            return { ...prev, meals: [...prev?.meals, responseData] };
          }
        });
        setSuccess(
          `${
            menu?.menuType.name === "Drinks Menu" ? "Drink" : "Meal"
          } added successfully.`
        );
        setTimeout(() => {
          setSuccess(undefined);
          handleCloseMealForm();
        }, 2000);
      } else {
        const error = response?.data;
        if (error) {
          setError(error.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleUpdateMeal = async (meal: IMealFormValues) => {
    try {
      setError(undefined);

      if (selectedMeal) {
        const response = await updateMeal(selectedMeal?._id, {
          ...meal,
          menu: menuId,
        });
        if (response?.status === 200) {
          const responseData = response.data as IMealData;
          const update = menu?.meals.map((meal) =>
            meal._id === responseData._id ? responseData : meal
          );
          setMenu((prev) => {
            if (prev) {
              return { ...prev, meals: update ?? [] };
            }
          });
          setSuccess(
            `${
              menu?.menuType.name === "Drinks Menu" ? "Drink" : "Meal"
            } updated successfully.`
          );
          setTimeout(() => {
            setSuccess(undefined);
            handleCloseMealForm();
          }, 2000);
        } else {
          const error = response?.data;
          if (error) {
            setError(error.error);
          } else {
            setError("An error occurred. Please try again later.");
          }
        }
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleDeleteMeal = async (props: {
    meal: IMealData;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => {
    const { meal, handleClose, handleDeleteError } = props;
    try {
      handleDeleteError(undefined);

      const response = await deleteMeal(meal._id);
      if (response?.status === 204) {
        setSuccess(
          `${
            menu?.menuType.name === "Drinks Menu" ? "Drink" : "Meal"
          } deleted successfully.`
        );
        setTimeout(() => {
          const update = menu?.meals.filter((i) => i._id !== meal._id);
          setMenu((prev) => {
            if (prev) {
              return { ...prev, meals: update ?? [] };
            }
          });
          setSuccess(undefined);
          handleClose();
        }, 2000);
      } else {
        const error = response?.data;
        if (error) {
          handleDeleteError(error.error);
        } else {
          handleDeleteError("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.log(error);
      handleDeleteError("An error occurred. Please try again later.");
    }
  };

  const handleUploadImage = async (
    file: File,
    callback: (error?: string) => void
  ) => {
    try {
      const response = await uploadMealImage(selectedMeal?._id ?? "", file);
      if (response?.status === 200) {
        const update = menu?.meals.map((meal) =>
          meal._id === response.data._id ? response.data : meal
        );
        setMenu((prev) => {
          if (prev) {
            return { ...prev, meals: update ?? [] };
          }
        });
        setSelectedMeal(response.data);
        callback?.();
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log(error);
      callback?.("error");
    }
  };

  const handleDeleteImage = async (callback: (error?: string) => void) => {
    try {
      const response = await deleteMealImage(selectedMeal?._id ?? "");
      if (response?.status === 200) {
        const update = menu?.meals.map((meal) =>
          meal._id === response.data._id ? response.data : meal
        );
        setMenu((prev) => {
          if (prev) {
            return { ...prev, meals: update ?? [] };
          }
        });
        setSelectedMeal(response.data);
        callback?.();
      } else {
        callback?.("error");
      }
    } catch (error) {
      console.log(error);
      callback?.("error");
    }
  };

  const getMealType = (id: string) =>
    mealTypes.find((type) => type._id === id)?.name ?? "";

  if (!menu) {
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
      <Box>
        <Box
          padding={2}
          display="flex"
          justifyContent="space-between"
          sx={{ borderBottom: "0.5px solid black" }}
        >
          <Box display="flex" alignItems="center">
            <ArrowBackIosIcon
              fontSize="small"
              sx={{ cursor: "pointer", mr: 2 }}
              onClick={() => router.push(`/admin/dashboard/joints/${slug}`)}
            />
            <Typography fontSize={18}>{menu.menuType.name}</Typography>
          </Box>
          <Button variant="contained" size="small" onClick={handleOpenMealForm}>
            <Typography>
              Add {menu.menuType.name === "Drinks Menu" ? "Drink" : "Meal"}
            </Typography>
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: "77vh" }}>
          {menu.meals.length > 0 ? (
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  {/* <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Verified</TableCell> */}
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menu.meals.map((item) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    hover
                  >
                    <TableCell onClick={() => handleOpenMealDetails(item)}>
                      <Typography>{item.name}</Typography>
                    </TableCell>
                    <TableCell onClick={() => handleOpenMealDetails(item)}>
                      <Chip
                        label={
                          <Typography fontSize={14}>
                            {getMealType(item.mealType)}
                          </Typography>
                        }
                        sx={{ mr: 1 }}
                      />
                    </TableCell>
                    <TableCell onClick={() => handleOpenMealDetails(item)}>
                      <Typography
                        fontSize={14}
                        sx={{
                          opacity: 0.5,
                          whiteSpace: "nowrap",
                          maxWidth: "280px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell onClick={() => handleOpenMealDetails(item)}>
                      <Typography>GHC {item.price.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <RowMenu
                        rowItem={item}
                        success={success}
                        handleOpenEdit={() => {
                          setSelectedMeal(item);
                          handleOpenMealForm();
                        }}
                        handleDelete={handleDeleteMeal}
                      />
                    </TableCell>

                    {/* <TableCell onClick={() => handleOpenDetails(item.slug)}>
                      <Typography>{item.name}</Typography>
                    </TableCell>
                    <TableCell onClick={() => handleOpenDetails(item.slug)}>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          maxWidth: "250px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.type.map((t) => (
                          <Chip
                            key={t._id}
                            label={
                              <Typography fontSize={14}>{t.name}</Typography>
                            }
                            sx={{ mr: 1 }}
                          />
                        ))}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handleOpenDetails(item.slug)}
                    >
                      <Typography>
                        {new Date(item.createdAt).toLocaleDateString("en-uk", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handleOpenDetails(item.slug)}
                    >
                      {item.verified ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="disabled" />
                      )}
                    </TableCell> */}
                    {/* <TableCell align="right">
                      <RowMenu rowItem={item} handleDelete={handleDelete} />
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box
              sx={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ opacity: 0.5 }}>Empty menu</Typography>
              </Box>
            </Box>
          )}
        </TableContainer>
      </Box>

      <Modal open={openMealForm} onClose={handleCloseMealForm}>
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
            <Typography fontSize={18}>
              {selectedMeal ? "Update" : "Add New"}{" "}
              {menu.menuType.name === "Drinks Menu" ? "Drink" : "Meal"}
            </Typography>
            <CloseIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={handleCloseMealForm}
            />
          </Box>
          <MealForm
            meal={selectedMeal}
            handleSubmit={selectedMeal ? handleUpdateMeal : handleAddMeal}
          />
          {success && (
            <Alert severity="success" icon={false}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" icon={false}>
              {error}
            </Alert>
          )}
        </Box>
      </Modal>

      <Modal open={openMealDetails} onClose={handleCloseMealDetails}>
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
            p: 2,
          }}
        >
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <CloseIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={handleCloseMealDetails}
            />
          </Box>
          <MealDetails
            meal={selectedMeal!}
            handleUpload={handleUploadImage}
            handleDelete={handleDeleteImage}
          />
        </Box>
      </Modal>
    </>
  );
}

const RowMenu = (props: IRowMenu) => {
  const { rowItem, success, handleOpenEdit, handleDelete } = props;

  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const open = Boolean(anchorEl);

  const [openDelete, setOpenDelete] = useState(false);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MoreVertIcon
        sx={{ cursor: "pointer" }}
        onClick={(e) => handleClick(e)}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleOpenEdit();
            handleClose();
          }}
        >
          <Typography fontSize={14}>Edit</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDelete(true);
            handleClose();
          }}
        >
          <Typography fontSize={14}>Delete</Typography>
        </MenuItem>
      </Menu>
      <DeleteMealDialog
        open={openDelete}
        meal={rowItem}
        success={success}
        handleClose={() => setOpenDelete(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
};

const DeleteMealDialog = (props: IDeleteMealDialog) => {
  const { open, meal, success, handleClose, handleDelete } = props;

  const [deleteError, setDeleteError] = useState<string>();

  const handleDeleteError = (error?: string) => {
    setDeleteError(error);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle id="alert-dialog-title">
        <Typography fontSize={18}>
          Are you sure you want to delete {meal?.name}?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ mr: 2, mb: 2 }}>
        <Button onClick={handleClose} variant="outlined" size="small">
          Cancel
        </Button>
        <Button
          onClick={() => handleDelete({ meal, handleClose, handleDeleteError })}
          variant="contained"
          size="small"
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
      <Container>
        {success && (
          <Alert severity="success" icon={false} sx={{ my: 2 }}>
            {success}
          </Alert>
        )}
        {deleteError && (
          <Alert severity="error" icon={false} sx={{ my: 2 }}>
            {deleteError}
          </Alert>
        )}
      </Container>
    </Dialog>
  );
};

interface IMenuTable {
  slug: string;
  menuId: string;
}

interface IRowMenu {
  rowItem: IMealData;
  success?: string;
  handleOpenEdit: () => void;
  handleDelete: (props: {
    meal: IMealData;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => void;
}

interface IDeleteMealDialog {
  open: boolean;
  meal: IMealData;
  success?: string;
  handleClose: () => void;
  handleDelete: (props: {
    meal: IMealData;
    handleClose: () => void;
    handleDeleteError: (error?: string) => void;
  }) => void;
}
