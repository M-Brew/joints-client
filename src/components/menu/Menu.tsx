import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import Meal from "../meals/Meal";
import MealForm from "../meals/MealForm";

import { getMenu } from "@/app/api/menus";
import { addMeal } from "@/app/api/meals";

export default function Menu(props: IMenu) {
  const { slug, menuId } = props;
  const router = useRouter();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const [menu, setMenu] = useState<IMenuData>();
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  const [openMenuForm, setOpenMenuForm] = useState(false);

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

  const handleOpenMenuForm = () => {
    setOpenMenuForm(true);
  };

  const handleCloseMenuForm = () => {
    setOpenMenuForm(false);
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
          handleCloseMenuForm();
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
    <Box p={3} sx={{ minHeight: "85vh" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ArrowBackIosIcon
            fontSize="small"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(`/admin/dashboard/joints/${slug}`)}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Typography fontSize={20}>{menu.menuType.name}</Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenMenuForm}
          >
            <Typography>
              Add {menu.menuType.name === "Drinks Menu" ? "Drink" : "Meal"}
            </Typography>
          </Button>
        </Grid>
        {menu.meals.map((meal) => (
          <Grid key={meal._id} item xs={12}>
            <Meal meal={meal} />
          </Grid>
        ))}
      </Grid>

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
            <Typography fontSize={18}>
              Add New {menu.menuType.name === "Drinks Menu" ? "Drink" : "Meal"}
            </Typography>
            <CloseIcon
              fontSize="small"
              sx={{ cursor: "pointer" }}
              onClick={handleCloseMenuForm}
            />
          </Box>
          <MealForm handleSubmit={handleAddMeal} />
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
    </Box>
  );
}

interface IMenu {
  slug: string;
  menuId: string;
}
