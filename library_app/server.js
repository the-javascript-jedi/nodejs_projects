// check if we are running in prod or dev environment
if (process.env.NODE_ENV !== "production") {
  // load dodotenv only in dev environment
  require("dotenv").config();
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
// import our index router
const indexRouter = require("./routes/index");
// set ejs as view engine
app.set("view engine", "ejs");
// set where views are coming from - we get current directory name and we will set them in a views directory
app.set("views", __dirname + "/views");
// hookup layout file - every single file will be put in this layout file so we don't duplicate header and footer
app.set("layout", "layouts/layout");
// use expres layouts
app.use(expressLayouts);
// tell express where public files are present eg:Images,CSS,JS files etc
app.use(express.static("public"));
// for a route path use the indexRouter
const mongoose = require("mongoose");
// pass the mongoose url as an environment variable and pass the fedault options
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("db error", (error) => console.log(error));
db.on("db open", () => console.log("connected to mongoose"));
app.use("/", indexRouter);
app.listen(process.env.PORT || 5000);
