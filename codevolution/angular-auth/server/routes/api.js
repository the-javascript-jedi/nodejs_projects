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

router.post("/login", (req, res) => {
  let userData = req.body;
  User.findOne({ email: userData.email })
    .then((user) => {
      console.log("user", user);
      if (!user) {
        res.status(401).send("Invalid Email");
      } else if (user.password !== userData.password) {
        res.status(401).send("Invalid Password");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => console.log(err));
});

router.get("/events", (req, res) => {
  let events = [
    {
      _id: "1",
      name: "Auto Expo 2012",
      description: "lorem ipsum",
      date: "2012",
    },
    {
      _id: "2",
      name: "Auto Expo 2013",
      description: "lorem ipsum",
      date: "2012",
    },
    {
      _id: "3",
      name: "Auto Expo 2014",
      description: "lorem ipsum",
      date: "2014",
    },
  ];
  res.json(events);
});

router.get("/special", (req, res) => {
  let events = [
    {
      _id: "1",
      name: "Auto Expo 2012",
      description: "lorem ipsum",
      date: "2012",
    },
    {
      _id: "2",
      name: "Auto Expo 2013",
      description: "lorem ipsum",
      date: "2012",
    },
    {
      _id: "3",
      name: "Auto Expo 2014",
      description: "lorem ipsum",
      date: "2014",
    },
  ];
  res.json(events);
});
module.exports = router;
