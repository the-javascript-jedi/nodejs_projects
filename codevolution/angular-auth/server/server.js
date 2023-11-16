const express = require("express");
const bodyParser = require("body-parser");

const PORT = 5000;
const api = require("./routes/api");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
// use routes /api
app.use("/api", api);
app.get("/", function (req, res) {
  res.send("Hello from server");
});
app.listen(PORT, function () {
  console.log("Server running on localhost:" + PORT);
});
