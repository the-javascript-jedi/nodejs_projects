const express = require("express");

const messagesController = require("../controllers/messages.controller");

const messagesRouter = express.Router();

messagesRouter.get("/", messagesController.getMessages);
messagesRouter.post("/", messagesController.postMessage);
// http://localhost:3000/messages/displayImage
messagesRouter.get("/displayImage", messagesController.sendImage);

module.exports = messagesRouter;
