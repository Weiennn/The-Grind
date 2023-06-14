import React, { useState, useContext } from "react";
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

// Adds the copyright @website thing at the bottom
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
// can be moved to root once settled on theme

function Login() {
  // State containing username typed in input
  const [username, setUsername] = useState("");
  // State containing password typed in input
  const [password, setPassword] = useState("");
  // Obtaining state containing user login details
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  // Function that is called when the login button is clicked
  const login = () => {
    // Data containing username and password
    const data = { username: username, password: password };
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
  };

  return (
    //TODO theme can be moved to root once settled on theme
    //TODO to change Logo
    <Container
      className="loginContainer"
      component="main"
      maxWidth="xs"
      style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box onSubmit={login} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="Username"
            label="Username"
            name="Username"
            autoComplete="Username"
            autoFocus
            type="text"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            id="password"
            autoComplete="current-password"
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={login}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 13 }} />
      {/*
        <div>
          <label>Username:</label>
          <input
            type="text"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <label>Password:</label>
          <input
            type="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button onClick={login}>Login</button>
        </div>
          */}
    </Container>
  );
}

export default Login;
