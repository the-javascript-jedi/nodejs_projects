const express = require("express");
const jwt = require("jsonwebtoken");
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

// middleware to verify JWT token
function verifyToken(req, res, next) {
  console.log("req.headers", req.headers);
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  console.log("token", token);
  if (token == "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  console.log("payload", payload);

  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.userId = payload.subject;
  next();
}

router.get("/", (req, res) => {
  res.send("From API route");
});

router.post("/register", (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  console.log("user", user);
  user
    .save()
    .then(function (registeredUser) {
      console.log("err-- registeredUser.save()", registeredUser);
      // send jwt as response
      let payload = { subject: registeredUser._id };
      let token = jwt.sign(payload, "secretKey");
      res.status(200).send({ token: token });
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
        let payload = { subject: user._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token: token });
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
//first token is verified then the events is returned
router.get("/special", verifyToken, (req, res) => {
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
