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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

import { getSettingItems } from "@/app/api/settings";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string(),
});

export default function JointForm(props: IJointForm) {
  const { joint, handleSubmit } = props;
  const [jointTypes, setJointTypes] = useState<ISettingItem[]>([]);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState<string>();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const response = await getSettingItems("joint-types");
        if (response?.status === 200) {
          setJointTypes(response.data ?? []);
        }
      } catch (error) {
        console.log({ error });
      }
    })();
  }, []);

  const formik: FormikProps<IJointFormValues> = useFormik<IJointFormValues>({
    initialValues: {
      name: "",
      description: "",
      type: [],
      address: "",
      latitude: 0,
      longitude: 0,
      phone: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!phoneError) {
        console.log({
          ...values,
          latitude: location?.latitude,
          longitude: location?.longitude,
          phone: numbers,
        });
      }
      handleSubmit?.({
        ...values,
        latitude: location?.latitude,
        longitude: location?.longitude,
        phone: numbers,
      });
    },
  });

  const handleAddNumber = (number: string) => {
    setNumbers((prev) => [...prev, number]);
  };

  const handleRemoveNumber = (number: string) => {
    const updated = numbers.filter((n) => n !== number);
    setNumbers(updated);
  };

  const handlePhoneError = (error?: string) => {
    if (error) {
      setPhoneError(error);
    } else {
      setPhoneError(undefined);
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      () => {
        setLocationError("Unable to retrieve your location");
        setLocationLoading(false);
      }
    );
  };

  const handleGetLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      getCurrentLocation();
    } else {
      setLocation(undefined);
    }
  };

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
              <InputLabel id="joint-type-label">Type</InputLabel>
              <Select
                labelId="joint-type-label"
                id="joint-type"
                name="type"
                multiple
                value={formik.values.type}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Name" />}
              >
                {jointTypes.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              autoComplete="chrome-off"
            />
          </Grid>
          <PhoneNumbers
            numbers={numbers}
            phoneError={phoneError}
            handleAddNumber={handleAddNumber}
            handleRemoveNumber={handleRemoveNumber}
            handlePhoneError={handlePhoneError}
          />
          <Grid item xs={12}>
            <FormControlLabel
              control={
                locationLoading ? (
                  <CircularProgress size="1rem" sx={{ mx: "1rem" }} />
                ) : (
                  <Checkbox checked={!!location} onChange={handleGetLocation} />
                )
              }
              label={<Typography>Use current location?</Typography>}
            />
            {locationError && (
              <Typography fontSize={12} ml={2} color="#d32f2f">
                {locationError}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ textAlign: "right" }}>
              <Button variant="contained" type="submit">
                <Typography>{joint ? "Update" : "Add"}</Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

interface IJointForm {
  joint?: IJointFormValues;
  handleSubmit?: (joint: IJointFormValues) => void;
}

const PhoneNumbers = (props: {
  numbers: string[];
  phoneError?: string;
  handleAddNumber: (number: string) => void;
  handleRemoveNumber: (number: string) => void;
  handlePhoneError: (error?: string) => void;
}) => {
  const {
    numbers,
    phoneError,
    handleAddNumber,
    handleRemoveNumber,
    handlePhoneError,
  } = props;
  const [newNumber, setNewNumber] = useState("");

  return (
    <>
      {numbers.map((number, idx) => (
        <Grid key={idx} item xs={12} container spacing={2}>
          <Grid item xs={11}>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label={`Phone ${idx + 1}`}
              value={number}
              disabled
            />
          </Grid>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CancelIcon
              sx={{ cursor: "pointer" }}
              onClick={() => handleRemoveNumber(number)}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={11}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            type="number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            onBlur={(e) =>
              e.target.value.length !== 10
                ? handlePhoneError("Phone number should be 10 digits long")
                : numbers.includes(e.target.value)
                ? handlePhoneError("Duplicate phone number")
                : handlePhoneError()
            }
            error={Boolean(phoneError)}
            helperText={phoneError}
          />
        </Grid>
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AddIcon
            sx={{ cursor: "pointer" }}
            onClick={
              newNumber.length > 0
                ? () => {
                    if (!phoneError) {
                      handleAddNumber(newNumber);
                      setNewNumber("");
                    }
                  }
                : () => {}
            }
          />
        </Grid>
      </Grid>
    </>
  );
};
