// bring the path module
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
// express-fileupload
const fileupload = require("express-fileupload");
const colors = require("colors");
// Load env vars
dotenv.config({ path: "./config/config.env" });
// connect to database
connectDB();
// Route Files from Express Router
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
// initialize app variable
const app = express();
// Body Parser
app.use(express.json());
//Dev logging middleware - morgan
//run only in dev environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// File uploading
app.use(fileupload());
// set the static folder
//path.join-joins files and folders together
//__dirname-current directory and go into public folder
app.use(express.static(path.join(__dirname, "public")));
console.log("__dirname", __dirname);
// Mount Route to specific URL
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
// If you want to use the error catcher middleware in the boot camps controller methods it has to be after this because Middlewares are executed in a linear order so it has to be after this if you
app.use(errorHandler);
const PORT = process.env.PORT || 5001;
// in order to run a server we neeed to call listlsen passing a port no
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
//Globally Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`.red);
  // close the server and exit process
  server.close(() => process.exit(1));
});
