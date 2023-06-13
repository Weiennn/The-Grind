const express = require("express");
const router = express.Router();

// Get Assignments model from the models folder
const { Assignments } = require("../models")

// Get assignments related to a specific user
router.get('/:userId', async (req, res) => {
    // Create a variable set to the userId param in the URL
    const userId = req.params.userId;
    // Get all assignments where userId is equal to the userId we are finding
    const assignments = await Assignments.findAll( { where: { UserId: userId } });
    // Return response in json format
    res.json(assignments);
});
/*
// Get specific assignment
router.get('/updateAssignment/:assignmentId', async (req, res) => {
    // Create a variable set to the assignmentId param in the URL
    const assignmentId = req.params.assignmentId;
    // Get the assignment where id is equal to the id we are finding
    const assignments = await Assignments.findByPK(assignmentId);
    // Return response in json format
    res.json(assignments);
});
*/
// Post an assignment to a specific user
router.post("/", async (req, res) => {
    // Create a variable set to the assignment data
    const assignment = req.body;
    // Add data to the database
    await Assignments.create(assignment);
    // Return response in json format
    res.json(assignment);
});

router.put("/updateAssignment/:assignmentId", async (req, res) => {
    // Create a variable set to the assignment data
    const assignment = req.body;
    // Create a variable set to the id
    const assignmentId = req.params.assignmentId;
    // Update data to the database
    await Assignments.update(assignment, { where: { id : assignmentId } });
    // Return response in json format
    res.json(assignment);
});

module.exports = router;