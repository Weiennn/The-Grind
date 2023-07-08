import React, { useState, useEffect } from "react";
import SpotifyPlayer from "./SpotifyPlayer";
import SpotifyLogin from "./SpotifyLogin";
import axios from "axios";
import { APICall } from "../helper/APICall";




export default function Spotify() {
  const [token, setToken] = useState("");

//   useEffect(() => {
//     axios.get(`${APICall}/spotify/token`).then((response) => {
//       setToken(response.data);
//     });
//   }, []);

  return (
    <div>
        { (token === "") ? (<SpotifyLogin />) : (<SpotifyPlayer token={token} />) }
    </div>
    );
}
