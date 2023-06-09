const express = require('express');
const cors = require('cors');

// Variable to make API requests and initialise server
const app = express();

// Parses incoming JSON requests and puts parsed data in req.body
app.use(express.json());
// Allows API requests
app.use(cors());

// Goes over all tables created in the models folder
const db = require('./models');

// Routers
const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);
const commentsRouter = require('./routes/Comments');
app.use("/comments", commentsRouter);
const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);
const assignmentsRouter = require('./routes/Assignments');
app.use("/assignments/", usersRouter);

// Go over all tables in models folder
db.sequelize.sync().then(() => {
    // Start the API with port 3001
    app.listen(3001, () => {
        console.log("Works")
    });
})



