// Logger Middleware @desc-logs request to console
// every piece of middleware we create we need to call next() which is passed in as the third argument we need to call this so that node knows to move on to the next piece of middleware in the cycle.
//Now since we created a variable(hello) and on this request object we have access to this within our routes.
const logger = (req, res, next) => {
  req.hello = "Hello World";
  console.log("Middleware ran");
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};
module.exports = logger;
