"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useFormik } from "formik";
import * as yup from "yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { adminSignIn } from "@/app/api/auth";

const validationSchema = yup.object({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function SignIn() {
  const [error, setError] = useState<string>();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password }) => {
      try {
        setError(undefined);
        const response = await adminSignIn({ email, password });
        if (response.status === 200) {
          const { accessToken, refreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          router.replace("/admin/dashboard");
        } else if (response.status === 401) {
          setError(response.data.error);
        } else {
          setError("An error occurred. Please try againg later.");
        }
      } catch (error: any) {
        if (error) {
          console.log({ error });
          setError("An error occurred. Please try againg later.");
        }
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        pt: "20vh",
        backgroundColor: "#f3f6f999",
      }}
    >
      <Box sx={{ width: matches ? "700px" : "80%" }}>
        <Card sx={{ padding: "3rem" }}>
          <CardContent>
            <Container>
              <Box>
                <Typography variant="h5" textAlign="center" mb={3}>
                  Sign In
                </Typography>
              </Box>
              <form onSubmit={formik.handleSubmit}>
                <Grid container item spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                      sx={{ mb: 3 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" type="submit" fullWidth>
                      <Typography>Sign In</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <Box
                mt={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography mr={1} sx={{ opacity: 0.5 }}>
                  Don&apos;t have an account?
                </Typography>
                <Link href="">
                  <u>
                    <Typography>Sign Up</Typography>
                  </u>
                </Link>
              </Box>
              {error && (
                <Box mt={3}>
                  <Alert
                    severity="error"
                    icon={false}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {error}
                  </Alert>
                </Box>
              )}
            </Container>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
