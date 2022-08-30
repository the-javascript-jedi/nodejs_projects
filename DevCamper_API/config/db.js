const mongoose = require("mongoose");
//mongoose method (mongoose.connect) returns a promise so we can use async/await
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    //  stops warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
};
module.exports = connectDB;
