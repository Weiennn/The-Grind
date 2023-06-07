// Function to check if token is valid
const { verify } = require('jsonwebtoken');

// Middleware to check if token is valid
const validateToken = (req, res, next) => {
    // Obtain the accessToken stored in the local storage
    const accessToken = req.header("accessToken");
    // If user is not logged in
    if (!accessToken) {
        return res.json({ error: "User not logged in" });
    }

    try {
        // Verify is token is valid using the same secret string used to create it
        const validToken = verify(accessToken, "importantsecret");
        // To store access token information in all requests
        req.user = validToken;
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json({ error: err });
    }
};

module.exports = { validateToken }