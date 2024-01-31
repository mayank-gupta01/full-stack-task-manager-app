const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//Import routes
const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");

//define routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);

module.exports = app;
