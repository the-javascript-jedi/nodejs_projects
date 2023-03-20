const express = require("express");
// const { searchGames } = require("./controllers/search-games");
// const { searchTableWithPagination } = require("./controllers/pagination-table");
// const { searchTableCount } = require("./controllers/pagination-table");
const app = express();
const mysql2 = require("mysql2");
const { faker } = require("@faker-js/faker");

// create connection
const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "mysqlroot",
  database: "db_join_us",
});
// test connection
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

// my sql commands
var q = "SELECT CURDATE()";
// command 1
connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});
// command 2
var q = "SELECT CURTIME() as time, CURDATE() as date, NOW() as now";
connection.query(q, function (error, results, fields) {
  if (error) throw error;
  // we can access the aliases created using as using dot notation in results
  console.log(results[0].time);
  console.log(results[0].date);
  console.log(results[0].now);
});
// close connection
connection.end();

// SET Headers to overcome CROSS Origin requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// //localhost:5000/api/games?&filter=halo
// app.route("/api/games").get(searchGames);
// // http://localhost:5000/api/searchTableWithPagination?&sortOrder=asc&pageNumber=1&pageSize=3
// app.route("/api/searchTableWithPagination").get(searchTableWithPagination);
// // get games data count
// // http://localhost:5000/api/searchTableCount
// app.route("/api/searchTableCount").get(searchTableCount);

function generateAddress() {
  console.log(faker.address.streetAddress());
  console.log(faker.address.city());
  console.log(faker.address.state());
}

generateAddress();
app.listen(5000, () => {
  console.log("running on port 5000");
});
