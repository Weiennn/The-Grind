const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require('../middlewares/AuthMiddleware')
// Used to generate the token
const { sign } = require('jsonwebtoken');
//const {createTokens, validateToken} = require("../middlewares/AuthMiddleware");

// Create a user
router.post("/", async (req, res) => {
    // Getting the username and password variables separately
    const { username, email, password } = req.body;
    // Hasing the password in the database
    bcrypt.hash(password, 10).then((hash) => {
        // Creating a user
        Users.create({
            username: username,
            email: `${email}`,
            password: hash,
        });
        res.json("SUCCESS");
    });
});

// Login
router.post('/login', async (req, res) => {
    // Getting the username and password variables separately
    const { username, password } = req.body;
    // Finding the right user
    const user = await Users.findOne({ where: { username: username } });
    // Check if the user does not exist
    if (!user) {
        res.json({error: "user does not exist"});
    } else {
        // Checks if the password is correct
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res.json({ error: "Wrong username and password combination"});
            } else {
                // Create token
                /*const accessToken = createTokens(user);
                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 1000,
                    httpOnly: false,
                });*/
                const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
                // Return token, username and id to be used
                res.json({ token: accessToken, username: user.username, id: user.id, email: user.email });
            } 
        });
    }  
});
/*
router.get('/logout', async (req, res) => {
    res.status(202).clearCookie('access-token').send('cookie cleared');
    console.log("cookie cleared");
})
*/
// Check if user has valid token
router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;