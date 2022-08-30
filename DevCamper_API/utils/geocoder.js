const NodeGeoCoder = require("node-geocoder");
const options = {
  // provider can be google,mapquest etc
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null, // 'gpx', 'string', .
};
const geocoder = NodeGeoCoder(options);
module.exports = geocoder;
