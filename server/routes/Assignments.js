const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware")

// Get Assignments model from the models folder
const { Assignments } = require("../models")

// Get assignments related to a specific user
router.get('/:postId', async (req, res) => {
    // Create a variable set to the postId param in the URL
    const postId = req.params.postId;
    // Get all comments where postId is equal to the postId we are finding
    const comments = await Comments.findAll( { where: { PostId: postId } });
    // Return response in json format
    res.json(comments);
});

// Post a comment to a specific post if the user is logged in
router.post("/", validateToken, async (req, res) => {
    // Create a variable set to the comment data
    const comment = req.body;
    // Create a variable set to the username obtained from AuthMiddleware.js
    const username = req.user.username;
    // Set the comment's username
    comment.username = username;
    // Add data to the database
    await Comments.create(comment);
    // Return response in json format
    res.json(comment);
});

module.exports = router;