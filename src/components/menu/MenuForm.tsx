import React, { useEffect, useState } from "react";

import { FormikProps, useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";

import { getSettingItems } from "@/app/api/settings";

const validationSchema = yup.object({
  menuType: yup.string().required("Menu type is required"),
});

export default function MenuForm(props: IMenuForm) {
  const { handleSubmit } = props;

  const [menuTypes, setMenuTypes] = useState<ISettingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const formik: FormikProps<{ menuType: string }> = useFormik<{
    menuType: string;
  }>({
    initialValues: {
      menuType: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setError(undefined);

      handleSubmit?.(values, (error) => {
        if (error) {
          setError(
            error === "error"
              ? "An error occurred. Please try again later"
              : error
          );
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await getSettingItems("menu-types");
        if (response?.status === 200) {
          setMenuTypes(response.data ?? []);
        }
      } catch (error) {
        console.log({ error });
      }
    })();
  }, []);

  return (
    <Box sx={{ my: 3 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="menu-type-label">Menu Type</InputLabel>
              <Select
                labelId="menu-type-label"
                id="menuType"
                name="menuType"
                value={formik.values.menuType}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Menu Type" />}
                error={Boolean(formik.errors.menuType)}
              >
                {menuTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                fontSize={12}
                sx={{ color: "#d32f2f", ml: 1, mt: 0.5 }}
              >
                {formik.errors.menuType}
              </Typography>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: "right" }}>
              <Button variant="contained" type="submit" disabled={loading}>
                <Typography>Create</Typography>
              </Button>
            </Box>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error" icon={false}>
                {error[0].toUpperCase() + error.substring(1)}
              </Alert>
            </Grid>
          )}
        </Grid>
      </form>
    </Box>
  );
}

interface IMenuForm {
  handleSubmit?: (
    values: { menuType: string },
    callback?: (error?: string) => void
  ) => void;
}
