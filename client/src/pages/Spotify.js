import React, { useState, useEffect, useContext } from "react";
import WebPlayback from "./WebPlayback";
import SpotifyLogin from "./SpotifyLogin";
import axios from "axios";
import { APICall } from "../helper/APICall";
import { AuthContext } from "../helper/AuthContext";


export default function Spotify() {
  const [token, setToken] = useState("");
  const { authState } = useContext(AuthContext);
  const userId = authState.id;

  useEffect(() => {
    axios.get(`${APICall}/spotify/token/${userId}`).then((response) => {
      setToken(response.data.token);
    });
  }, []);

  return (
    <div>{token === "" ? <SpotifyLogin /> : <WebPlayback token={token} />}
    {token}</div>
  );
}
