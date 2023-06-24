const express = require('express');
const cors = require('cors');
const path = require('path')
//const dotenv = require('dotenv')
//const cookieParser = require("cookie-parser");
//dotenv.config()

// Variable to make API requests and initialise server
const app = express();
const port = process.env.PORT || 3001

const buildPath = path.join('client', 'build');

// Parses incoming JSON requests and puts parsed data in req.body
app.use(express.json());
// Allows API requests
app.use(cors());
//app.use(cookieParser());
app.use(express.static(buildPath))

// Goes over all tables created in the models folder
const db = require('./models');

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
})

// Routers
const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);
const commentsRouter = require('./routes/Comments');
app.use("/comments", commentsRouter);
const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);
const assignmentsRouter = require('./routes/Assignments');
app.use("/assignments/", assignmentsRouter);

// Go over all tables in models folder
db.sequelize.sync().then(() => {
    // Start the API with port
    app.listen(port, () => {
        console.log("Works")
    });
})



