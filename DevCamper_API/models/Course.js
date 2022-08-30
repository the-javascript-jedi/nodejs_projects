const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    // enum means data must only be of the specified value inside array
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailalbe: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //add the bootcamp schema as a field, to establish a relationship with the bootcampSchema
  // type: is called ObjectID (i.e- when we create a new document we create an ObjectId)
  //ref:to know which model to reference
  //required is true so every course has a bootcamp
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});
// statics in mongoose are methods we call directly on the modal
// static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  // console.log("Calculating avg cost...".blue);
  // an aggregated object will contain an array value as the average cost {[_id:123,averageCost:1000]}
  //aggregate will return a promise so we use await
  //this takes a pipeline([{}]), we have different steps and operators we can use $match, $group etc
  const obj = await this.aggregate([
    {
      //$match - Filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage.
      // $match - match bootcamp with whatever bootcamp that is passed in - as bootcampId
      $match: { bootcamp: bootcampId },
    },
    {
      //$group- Groups input documents by the specified _id expression and for each distinct grouping, outputs a document. The _id field of each output document contains the unique group by value.
      $group: {
        // id is the bootcamp id
        _id: "$bootcamp",
        // $avg- average and the field we need to average
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  // console.log("models--Course.js--obj", obj);
  // save to db
  try {
    // add the id to be updated along with the data which needs to be changed
    // add the calculated aggregated averageCost value to the db with a key averageCost
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      // the obj returned from aggregate has an array with id and average cost
      // remove the decimal values using math.ceil
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.log(err);
  }
};
// Call getAverageCost after save --so use .post('save')
CourseSchema.post("save", function () {
  // run the averageCost
  //since getAverageCost is a static model we need to run it on the actual model
  //on save bootcamp field is created with bootcamp id, bootcamp is the id of the field so we need to pass it in with this.bootcamp
  this.constructor.getAverageCost(this.bootcamp);
});
// Call getAverageCost before remove so use .pre('remove')
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
