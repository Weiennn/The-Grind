const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware")

// Get comments related to a specific postId
router.get('/:postId', async (req, res) => {
    // Create a variable set to the postId param in the URL
    const postId = req.params.postId;
    // Get all comments where postId is equal to the postId we are finding
    const comments = await Comments.findAll( { where: { PostId: postId } });
    // Return response in json format
    res.json(comments);
});

// Post a comment to a specific post
router.post("/", validateToken, async (req, res) => {
    // Create a variable set to the comment data
    const comment = req.body;
    // Create a variable set to the username
    const username = req.user.username;
    // Set the comment's username
    comment.username = username;
    // Add data to the database
    await Comments.create(comment);
    // Return response in json format
    res.json(comment);
});

module.exports = router;