const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require('../middlewares/AuthMiddleware')
// Used to generate the token
const { sign } = require('jsonwebtoken');

// Create a user
router.post("/", async (req, res) => {
    // Getting the username and password variables separately
    const { username, password } = req.body;
    // Hasing the password in the database
    bcrypt.hash(password, 10).then((hash) => {
        // Creating a user
        Users.create({
            username: username,
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
                const accessToken = sign({ username: user.username, id: user.id }, "importantsecret");
                // Return token, username and id to be used
                res.json({ token: accessToken, username: user.username, id: user.id });
            } 
        });
    }  
});

// Check if user has valid token
router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;