const express = require("express");
const todoRoutes = require("./routes/todo.routes");
const userRoutes = require("./routes/user.routes");
const app = express();
const mongodbConnecter = require("./mongodb/mongodb.connecter");

mongodbConnecter.connect();

app.use(express.json());

app.use("/todos", todoRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({message: error.message});
})

module.exports = app;
