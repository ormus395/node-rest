const path = require("path");

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Routes and other dev made middleware imports
const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

app.use("/feed", feedRoutes);

app.use((req, res, next) => {
  res.json({ message: "The resource does not exist" });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode).json({
    message: error.message,
    error: error.toString(),
  });
});

mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log("Server started on port " + port);
    });
  })
  .catch((err) => console.log(err));
