const express = require("express");

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
var data = [];
for (var i = 0; i < 500; i++) {
  data.push([faker.internet.email(), faker.date.past()]);
}

var q = "INSERT INTO users (email, created_at) VALUES ?";

connection.query(q, [data], function (err, result) {
  console.log(err);
  console.log(result);
});

// connection.end();
// mqsql-2-To count the number of users in the database:
var q = "SELECT COUNT(*) AS total FROM users ";
connection.query(q, function (error, results, fields) {
  if (error) throw error;
  console.log("results[0].total", results[0].total);
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

app.listen(5000, () => {
  console.log("running on port 5000");
});
