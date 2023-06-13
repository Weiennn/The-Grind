import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const defaultTheme = createTheme();

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
    axios.post("http://localhost:3001/auth", data).then(() => {
      // Send data to the route for user login
      axios.post("http://localhost:3001/auth/login", data).then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // Set accessToken inside localStorage
          localStorage.setItem("accessToken", response.data.token);
          // When logging in, set status to be true to signify being logged in and obtain the username as well as id
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
          // Change to home page
          navigate("/");
        }
      });
    });
  };

  //TODO change icon
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="registrationContainer" maxWidth="xs">
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
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
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
                  <Field name="username">
                    {({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        id="inputNewPost"
                        label="Username"
                        autoComplete="username"
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <ErrorMessage name="password" component="span" />
                  <Field name="password">
                    {({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        type="password"
                        id="inputNewPost"
                        label="Password"
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
                color="primary"
                id="registrationButton"
              >
                Sign up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>

        {/*
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          <Form class="formContainer">
            <label>Username: </label>
            <ErrorMessage name="username" component="span" />
            <Field
              id="inputNewPost"
              name="username"
              placeholder="John cena..."
            />
            <label>Password: </label>
            <ErrorMessage name="password" component="span" />
            <Field
              type="password"
              id="inputNewPost"
              name="password"
              placeholder="Password..."
            />
            <button type="submit"> Register </button>
          </Form>
        </Formik>
                  */}
      </Container>
      <Copyright sx={{ mt: 14 }} />
    </ThemeProvider>
  );
}

export default Registration;
