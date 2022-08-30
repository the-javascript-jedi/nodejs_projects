const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  // make a copy of all the elements in error using spread operator
  let error = { ...err };
  error.message = err.message;
  // Log to console for dev
  // console.log(err.stack.red);
  // this displays the error type name eg:CastError-imporoper id
  // console.log(err.name);
  // Log to console for dev
  console.log("err", err);
  // Mongoose Bad Object ID
  if (err.name === "CastError") {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }
  // Mongoose validation error
  if (err.name == "ValidationError") {
    // we create an array of error elements using Object.values and map through them to get the error messages
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};
module.exports = errorHandler;
