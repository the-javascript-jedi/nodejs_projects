// extend the error class
class ErrorResponse extends Error {
  // take a message and status code as arguments
  constructor(message, statusCode) {
    // Now the error class that we're extending we want to call that constructor so we can do that with super.
    // And that actually has its own message properties so we're gonna just pass in our message into that and then we're gonna create a custom property on this class called status code and set that to whatever's passed in here is a status code
    super(message);
    this.statusCode = statusCode;
  }
}
module.exports = ErrorResponse;
