import { useEffect, useState } from "react";
import { FormikProps, useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

import { getSettingItems } from "@/app/api/settings";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string(),
  mealType: yup.string().required("Meal type is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price should be more than 0"),
});

export default function MealForm(props: IMealForm) {
  const { meal, handleSubmit } = props;
  const [mealTypes, setMealTypes] = useState<ISettingItem[]>([]);

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

  const formik: FormikProps<IMealFormValues> = useFormik<IMealFormValues>({
    initialValues: {
      name: meal?.name ?? "",
      description: meal?.description ?? "",
      mealType: meal?.mealType ?? "",
      price: meal?.price ?? 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit?.(values);
    },
  });

  return (
    <Box sx={{ my: 3 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              autoComplete="chrome-off"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              multiline
              minRows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="meal-type-label">Type</InputLabel>
              <Select
                labelId="meal-type-label"
                id="mealType"
                name="mealType"
                value={formik.values.mealType}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Type" />}
                error={
                  formik.touched.mealType && Boolean(formik.errors.mealType)
                }
              >
                {mealTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.mealType && Boolean(formik.errors.mealType) && (
                <Typography
                  fontSize={12}
                  sx={{ color: "#d32f2f", ml: 1, mt: 0.5 }}
                >
                  {formik.errors.mealType}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="price"
              name="price"
              label="Price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">GHC</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ textAlign: "right" }}>
              <Button variant="contained" type="submit">
                <Typography>{meal ? "Update" : "Add"}</Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

interface IMealForm {
  meal?: IMealData;
  handleSubmit?: (meal: IMealFormValues) => void;
}
