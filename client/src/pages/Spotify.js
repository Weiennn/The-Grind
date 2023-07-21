import React, { useState, useEffect, useContext } from "react";
import WebPlayback from "./WebPlayback";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { APICall } from "../helper/APICall";
import { AuthContext } from "../helper/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

export default function Spotify() {
  const [token, setToken] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { authState } = useContext(AuthContext);
  const userId = authState.id;
  let navigate = useNavigate();
  let theme = useTheme();

  async function updateDB(code) {
    try {
      const authOptions = await axios.get(
        `${APICall}/spotify/callback?code=${code}`
      );
      const authOptionsLink = authOptions.data.url;
      const body = authOptions.data.form;
      const header = authOptions.data.headers;

      const response = await axios.post(authOptionsLink, body, {
        headers: header,
      });
      const access_token = response.data.access_token;
      setToken(access_token);
      await axios.post(`${APICall}/spotify/token/${userId}`, {
        access_token: access_token,
      });
      navigate("/spotify");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function onLoginClick() {
    try {
      const response = await axios.get(`${APICall}/spotify/spotifyLogin`);
      const authorizationUrl = response.data.url;

      // Redirect the user to the authorization URL
      window.location.replace(authorizationUrl);

      // Wait for the code and update the database
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("code")) {
        const code = urlParams.get("code");
        updateDB(code);
      } else {
        // Retry after a short delay
        setTimeout(() => {
          const code = urlParams.get("code");
          if (code) {
            updateDB(code);
          } else {
            console.log("Code not found.");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const onRefresehClick = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    axios.get(`${APICall}/spotify/token/${userId}`).then((response) => {
      if (response.data.token !== null) {
        setToken(response.data.token);
      } else {
        setToken("");
      }
    });
  }, []);

  useEffect(() => {
    axios.get(`${APICall}/spotify/token/${userId}`).then((response) => {
      if (response.data.token !== null) {
        setToken(response.data.token);
      } else {
        setToken("");
      }
    });
  }, [refresh]);

  return (
    <div>
      {token === "" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "5px solid",
            borderColor: theme.palette.primary.main,
            padding: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
              fontWeight: "bold",
            }}
          >
            Function still in beta, please be patient.
          </Typography>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              Step 1: Press Login to Spotify.
            </Typography>
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              Step 2: Allow access to Timetrekker.
            </Typography>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Step 3: Press Start Player.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              onClick={(onLoginClick)}
              color="secondary"
            >
              Login to Spotify
            </Button>
            <Button
              variant="contained"
              onClick={onRefresehClick}
              color="secondary"
            >
              Start Player
            </Button>
          </Box>
        </Box>
      ) : (
        <WebPlayback token={token} />
      )}
    </div>
  );
}
