const express = require("express");
const bodyParser = require("body-parser");

const PORT = 5000;
const api = require("./routes/api");
const app = express();

app.use(bodyParser.json());
// use routes /api
app.use("/api", api);
app.get("/", function (req, res) {
  res.send("Hello from server");
});
app.listen(PORT, function () {
  console.log("Server running on localhost:" + PORT);
});
////////////////////////////////////////////////////////
//working
// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();

// mongoose
//   .connect("mongodb://0.0.0.0:27017/eventsdb")
//   .then(() => {
//     console.log("Successfully Connected!!!");
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });
// app.listen(5000, () => {
//   console.log("on port 5000");
// });
