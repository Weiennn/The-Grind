import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import { APICall } from "../helper/APICall";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit">The Grind</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Registration() {
  // Obtaining state containing user login details
  const { setAuthState } = useContext(AuthContext);

  // initial values for the form
  const initialValues = {
    username: "",
    password: "",
  };

  // Requirements for form input
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  let navigate = useNavigate();

  // What happens when the submit button is clicked
  const onSubmit = (data) => {
    // Post data to the route for users
    axios.post(`${APICall}/auth`, data).then(() => {
      // Send data to the route for user login
      axios.post(`${APICall}/auth/login`, data).then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // Set accessToken inside localStorage
          sessionStorage.setItem("accessToken", response.data.token);
          // When logging in, set status to be true to signify being logged in and obtain the username as well as id
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            stay: false,
          });
          // Change to home page
          navigate("/");
        }
      });
    });
  };

  return (
    <Container
      maxWidth="xs"
      style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}
    >
      <CssBaseline />
      <Box
        sx={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          label="sign-up-text"
          component="h1"
          variant="h5"
          sx={{ mb: 2 }}
        >
          Sign up
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ErrorMessage name="username" component="span" />
                <Field name="username" label="Username">
                  {({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="Username"
                      autoComplete="username"
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <ErrorMessage name="password" component="span" />
                <Field name="password" label="Password">
                  {({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      type="password"
                      label="Password"
                      data-testid="password-input"
                      autoComplete="new-password"
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I would like to receive information about the goods and services which may be provided by
                    the Grind via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
              id="registrationButton"
            >
              Sign up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </Box>
      <Copyright sx={{ mt: 22 }} />
    </Container>
  );
}

export default Registration;
