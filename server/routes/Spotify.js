const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const axios = require("axios");
const cors = require("cors");

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const generateRandomString = (length) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.use(cors());

router.get("/", (req, res) => {
  console.log("hello");
});

router.get("/spotifyLogin", (req, res) => {
  const scope =
    "streaming \
    user-read-email \
    user-read-private";

  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3001/spotify/callback",
    state: state,
  });

  const spotifyAuthorizeUrl =
    "https://accounts.spotify.com/authorize/?" +
    auth_query_parameters.toString(); 

  console.log("login");
  // Redirect the client to the Spotify authorization URL
  res.json({ url: spotifyAuthorizeUrl });
});

router.get("/callback", (req, res) => {
  
  const code = req.query.code;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: "http://localhost:3001/spotify/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  axios
    .post(authOptions.url, authOptions.form, {
      headers: authOptions.headers,
    })
    .then((response) => {
      const access_token = response.data.access_token;
      // Send the access token back to the client-side application
      res.json({ access_token });
      console.log(response.data);
    })
    .catch((error) => {
      // Handle the error
      res.status(500).json({ error: "Failed to obtain access token" });
    });
});

// router.get("/token", (req, res) => {
//   res.json({
//     access_token: access_token,
//   });
// });

module.exports = router;
