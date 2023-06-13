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

// Post a comment to a specific post if the user is logged in
router.post("/", validateToken, async (req, res) => {
    // Create a variable set to the comment data
    const comment = req.body;
    // Create a variable set to the username obtained from AuthMiddleware.js
    const username = req.user.username;
    // Set the comment's username
    comment.username = username;
    // Add data to the database
    const newComment = await Comments.create(comment);
    // Return response in json format
    res.json(newComment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
    // Create a variable set to the commentId param in the URL
    const commentId = req.params.commentId;
    // Delete the comment where the commentId is equal to the commentId we are finding
    await Comments.destroy({
        where: {
            id: commentId
        }
    });
    // Return response in json format
    res.json("DELETED SUCCESSFULLY");
})

module.exports = router;