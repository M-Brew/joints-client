import { useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string(),
});

export default function SettingsForm(props: ISettingsForm) {
  const { item, handleSubmit } = props;

  const formik = useFormik({
    initialValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
    },
    validationSchema: validationSchema,
    onSubmit: ({ name, description }) => {
      handleSubmit?.(name, description);
    },
  });

  return (
    <Box sx={{ my: 3 }}>
      <form onSubmit={formik.handleSubmit}>
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
          sx={{ mb: 2 }}
        />
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
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: 2 }}
          multiline
          minRows={3}
        />
        <Box sx={{ textAlign: "right" }}>
          <Button variant="contained" type="submit">
            <Typography>{item ? "Update" : "Add"}</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
}

interface ISettingsForm {
  item?: {
    name: string;
    description?: string;
  };
  handleSubmit?: (name: string, description: string) => void;
}
