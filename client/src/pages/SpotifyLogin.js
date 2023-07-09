import React from "react";
import { useContext, useState } from "react";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { APICall } from "../helper/APICall";
import { AuthContext } from "../helper/AuthContext";

export default function SpotifyLogin() {
  const { authState } = useContext(AuthContext);
  const [words, setWords] = useState("default");
  const userId = authState.id;

  async function updateDB() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
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

      console.log(access_token);
      setWords(access_token);

      await axios.post(`${APICall}/spotify/token/${userId}`, {
        access_token: access_token,
      });
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

      // Wait for the user to complete authorization and obtain the authorization code
      const checkCode = setInterval(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("code")) {
          clearInterval(checkCode);
          updateDB();
        }
      }, 1);
      //improve reliability
    } catch (error) {
      console.error("Error:", error);
    }
  }



  //   const onLoginClick = () => {
  //     axios
  //       .get(`${APICall}/spotify/spotifyLogin`)
  //       .then((response) => {
  //         const authorizationUrl = response.data.url;
  //         //   // Redirect the user to the obtained authorization URL
  //         window.location.href = authorizationUrl;
  //       })

  //       .then((response) => {
  //         const currentURL = window.location.href;
  //         const code = currentURL.split("?code=")[1];
  //         axios
  //           .get(`${APICall}/spotify/callback?code=${code}`)
  //           .then((response) => {
  //             axios.post(response.data.url)
  //               .then((response) => {
  //                 const access_token = response.data.access_token;
  //                 axios
  //                   .post(`${APICall}/spotify/token/${userId}`, {
  //                     access_token: access_token,
  //                   })
  //                   .then((response) => {
  //                     console.log(response.data);
  //                   });
  //               })
  //               .catch((error) => {
  //                 console.error("Error:", error);
  //               });
  //           });
  //       });
  //   };

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="contained" onClick={onLoginClick}>
          Login to Spotify
        </Button>
        <Typography variant="h6">{words}</Typography>
      </header>
    </div>
  );
}
