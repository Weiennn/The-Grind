const express = require("express");
const router = express.Router();
//const { validateToken } = require("../middlewares/AuthMiddleware")

// Get Assignments model from the models folder
const { Assignments } = require("../models")

// Get assignments related to a specific user
router.get('/:userId', async (req, res) => {
    // Create a variable set to the userId param in the URL
    const userId = req.params.userId;
    // Get all assignments where postId is equal to the postId we are finding
    const assignments = await Assignments.findAll( { where: { UserId: userId } });
    // Return response in json format
    res.json(assignments);
});

// Post a comment to a specific post if the user is logged in
router.post("/", async (req, res) => {
    // Create a variable set to the comment data
    const assignment = req.body;
    // Create a variable set to the username obtained from AuthMiddleware.js
   // const id = req.user.id;
    // Set the comment's username
    //assignment.UserId = id;
    // Add data to the database
    await Assignments.create(assignment);
    // Return response in json format
    res.json(assignment);
});

module.exports = router;