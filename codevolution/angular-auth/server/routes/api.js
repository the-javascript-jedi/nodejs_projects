const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

// change ://localhost:27017/ to ://0.0.0.0:27017/
const db = "mongodb://0.0.0.0:27017/eventsdb";
function connectToMongoDb() {
  mongoose
    .connect(db)
    .then(() => {
      console.log("Successfully Connected!!!");
    })
    .catch((err) => {
      console.log("err", err);
    });
}
// connect to mongodb
connectToMongoDb();

router.get("/", (req, res) => {
  res.send("From API route");
});

router.post("/register", (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  console.log("user", user);
  user
    .save()
    .then(function (models) {
      console.log("err-- models.save()", models);
      res.status(200).send(models);
    })
    .catch(function (err) {
      console.log("err-- user.save()", err);
    });
});
module.exports = router;
