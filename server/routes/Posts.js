const express = require("express");
const router = express.Router();

// Get Posts model from the models folder
const { Posts } = require("../models")

// Get all posts
router.get("/", async (req, res) => {
    // Create a variable set to all posts in the table
    const listOfPosts = await Posts.findAll();
    // Return response in json format
    res.json(listOfPosts);
});

// Get post based on id
router.get('/byId/:id', async (req, res) => {
    // Create a variable set to the id param in the URL
    const id = req.params.id;
    // Choosing the right post using the id
    const post = await Posts.findByPk(id);
    // Return response in json format
    res.json(post);
})

// Create a new post
router.post("/", async (req, res) => {
    // Create a variable set to the post data
    const post = req.body;   
    // Add data to the database
    await Posts.create(post);
    // Return response in json format
    res.json(post);
});

module.exports = router;