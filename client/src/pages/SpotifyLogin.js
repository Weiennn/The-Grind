import React from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { APICall } from "../helper/APICall";

export default function SpotifyLogin() {
  const onLoginClick = () => {
    axios.get(`${APICall}/spotify/spotifyLogin`).then((response) => {
      const authorizationUrl = response.data.url;
      //   // Redirect the user to the obtained authorization URL
      window.location.href = authorizationUrl;
      console.log(response.data)
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="contained" onClick={onLoginClick}>
          Login to Spotify
        </Button>
      </header>
    </div>
  );
}
