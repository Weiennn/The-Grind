const express = require("express");
const router = express.Router();

// Get Assignments model from the models folder
const { Assignments } = require("../models");

// Get assignments related to a specific user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  // Create a variable set to all assignments in the table
  const notCompletedListOfAssignments = await Assignments.findAll({
    where: { completed: false, UserId: userId },
  });
  const completedListOfAssignments = await Assignments.findAll({
    where: { completed: true, UserId: userId },
  });
  const listOfAssignments = [
    ...notCompletedListOfAssignments,
    ...completedListOfAssignments,
  ];

  // Return response in json format
  res.json(listOfAssignments);
});

/*
// Get specific assignment
router.get('/updateAssignment/:assignmentId', async (req, res) => {
    // Create a variable set to the assignmentId param in the URL
    const assignmentId = req.params.assignmentId;
    // Get the assignment where id is equal to the id we are finding
    const assignment = await Assignments.findByPK(assignmentId);
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

router.put("/title", async (req, res) => {
  // Create a variable set to the changed data
  const { title, id } = req.body;
  // Create a variable set to the id
  //const id = req.params.id;
  // Update data to the database
  await Assignments.update({ title: title }, { where: { id: id } });
  // Return response in json format
  res.json(req.body);
});

router.put("/desc", async (req, res) => {
  // Create a variable set to the changed data
  const { description, id } = req.body;
  // Create a variable set to the id
  //const id = req.params.id;
  // Update data to the database
  await Assignments.update({ description: description }, { where: { id: id } });
  // Return response in json format
  res.json(req.body);
});

router.put("/deadline", async (req, res) => {
  // Create a variable set to the changed data
  const { deadline, id } = req.body;
  // Create a variable set to the id
  //const id = req.params.id;
  // Update data to the database
  await Assignments.update({ deadline: deadline }, { where: { id: id } });
  // Return response in json format
  res.json(req.body);
});

router.put("/completed", async (req, res) => {
  // Create a variable set to the changed data
  const { completed, id } = req.body;
  const assignmentObj = await Assignments.findOne({ where: { id: id } });
  if (assignmentObj.recurring != null && assignmentObj.recurring === true) {
    // Update data to the database
    await Assignments.update({ completed: completed }, { where: { id: id } });
    res.json("updated");
  } else {
    // else remove it from db
    await Assignments.destroy({ where: { id: id } });
    res.json("deleted");
  }
});

router.put("/resetRecurring", async (req, res) => {
  const listOfAssignments = await Assignments.findAll();
  const filteredList = listOfAssignments.filter(
    (assignment) => assignment.recurring === true
  );
  await Promise.all(
    filteredList.map(async (assignment) => {
      await Assignments.update(
        { completed: false },
        { where: { id: assignment.id } }
      );
    })
  );
  const newListOfAssignments = await Assignments.findAll();
  res.json(newListOfAssignments);
});

router.delete("/:id", async (req, res) => {
  // Create a variable set to the id
  const id = req.params.id;
  // Delete data from the database
  await Assignments.destroy({ where: { id: id } });
  // Return response in json format
  res.json("Deleted");
});

module.exports = router;
