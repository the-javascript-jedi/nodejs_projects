// require the file system module- included with node no need to install separately
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
// Load env vars
dotenv.config({ path: "./config/config.env" });
// Load Models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  //  stops warnings
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
//   Read JSON Files
// parse the json and add
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
// Import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
// Delete Data
const deleteData = async () => {
  try {
    // deleteMany-mongoose method deletes all records if no data is passed
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};
//process.argv[2] is the argument array passed in
//node seeder -i = i
if (process.argv[2] === "-i") {
  importData();
} else {
  deleteData();
}
