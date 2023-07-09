const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const cors = require("cors");
const { Users } = require("../models");

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
    redirect_uri: "http://localhost:3000/spotify",
    state: state,
  });

  const spotifyAuthorizeUrl =
    "https://accounts.spotify.com/authorize/?" +
    auth_query_parameters.toString();

  // Redirect the client to the Spotify authorization URL
  console.log("login");
  res.json({ url: spotifyAuthorizeUrl });
});

router.get("/callback", (req, res) => {
  const code = req.query.code;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: "http://localhost:3000/spotify",
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
  console.log("callback");
  res.json(authOptions);
});

router.post("/token/:userId", async (req, res) => {
    console.log("token");
    console.log(req.body.access_token);
    console.log(req.params.userId);
    await Users.update(
        { spotifyToken: req.body.access_token },
        { where: { id: req.params.userId } }
    );
    res.json("SUCCESS");
});

router.get("/token/:userId", (req, res) => {
    Users.findOne({ where: { id: req.params.userId } }).then((user) => {
        res.json({ token: user.spotifyToken });
    });
});

module.exports = router;
