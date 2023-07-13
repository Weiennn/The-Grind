// import React from "react";
// import { useContext, useState } from "react";
// import { Button, Typography } from "@mui/material";
// import axios from "axios";
// import { APICall } from "../helper/APICall";
// import { AuthContext } from "../helper/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function SpotifyLogin(props) {
//   const { authState } = useContext(AuthContext);
//   const [hasError, setHasError] = useState(false);
//   const userId = authState.id;
//   let navigate = useNavigate();

//   async function updateDB() {
//     try {
//       const urlParams = new URLSearchParams(window.location.search);
//       const code = urlParams.get("code");
//       const authOptions = await axios.get(
//         `${APICall}/spotify/callback?code=${code}`
//       );
//       const authOptionsLink = authOptions.data.url;
//       const body = authOptions.data.form;
//       const header = authOptions.data.headers;

//       const response = await axios.post(authOptionsLink, body, {
//         headers: header,
//       });
//       const access_token = response.data.access_token;

//       await axios
//         .post(`${APICall}/spotify/token/${userId}`, {
//           access_token: access_token,
//         })
//         .then(() => {
//           navigate("/spotify");
//         });
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   async function onLoginClick() {
//     try {
//       const response = await axios.get(`${APICall}/spotify/spotifyLogin`);
//       const authorizationUrl = response.data.url;

//       // Redirect the user to the authorization URL
//       window.location.replace(authorizationUrl);

//       // Wait for the user to complete authorization and obtain the authorization code
//       const checkCode = setInterval(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         if (urlParams.has("code")) {
//           clearInterval(checkCode);
//           updateDB();
//         } else if (urlParams.has("error")) {
//           clearInterval(checkCode);
//           setHasError(true);
//           navigate("/spotify");
//         }
//       }, 1);
//       //improve reliability
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Button variant="contained" onClick={onLoginClick}>
//           Login to Spotify
//         </Button>
//         {hasError && (
//           <Typography variant="h6" gutterBottom>
//             Error logging in to Spotify
//           </Typography>
//         )}
//       </header>

//     </div>
//   );
// }
