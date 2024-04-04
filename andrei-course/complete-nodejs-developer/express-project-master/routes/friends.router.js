const express = require("express");

const friendsController = require("../controllers/friends.controller");

const friendsRouter = express.Router();
// middleware only for friends route
// use next to move to the next function
friendsRouter.use((req, res, next) => {
  console.log("ip address:", req.ip);
  next();
});
friendsRouter.post("/", friendsController.postFriend);
friendsRouter.get("/", friendsController.getFriends);
friendsRouter.get("/:friendId", friendsController.getFriend);

module.exports = friendsRouter;
