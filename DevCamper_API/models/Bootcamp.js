const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
const BootcampSchema = new mongoose.Schema(
  {
    // we provide the name in object format so that the validation can be applied
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    // slug is a url friendly version of the name,
    //in this case we can use the slug for the front end
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      unique: true,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone number can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    //   address sent to server from client
    //we will take address and use geo coder to get the lattitude and longitude
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      //type is a GeoJSON Point
      // https://mongoosejs.com/docs/geojson.html
      //it has two required fields type and coordinates
      //enum means point is the only available value this can be
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      // enum means this can only be of the below data types
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  // enabling virtuals
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// create bootcamp slug from the name
//we can use .pre to run before the operation or we can use .post to run the operation after the post
// before we save the data we need to create the slug
// we must pass in next and call next so the middleware will move to the next middleware
BootcampSchema.pre("save", function (next) {
  // we can access the field name using this.name
  console.log("Slugify,ran", this.name);
  // we assign a slug name to the slug:string in the schema
  this.slug = slugify(this.name, { lower: true });
  next();
});
// Geocode &create location field
//Geocode method is async function so we must use.then or async/await
BootcampSchema.pre("save", async function (next) {
  // we can access any of the schema fields using .this
  const loc = await geocoder.geocode(this.address);
  // in order to use GeoJson point the type and coordinates are required fields
  this.location = {
    type: "Point",
    // the received loc value contains lattitude and longitude as an array
    //i.e. [{lattitude:00,longitude:01,country:'France',countryCode:'FR'}]
    cooordinates: [loc[0].longitude, loc[0].lattitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  // do not save address in db because we are getting the data in the geocode
  this.address = undefined;
  next();
});
// Cascade delete courses when a bootcamp is deleted
//findByIdAndDelete function will not work for this middleware so we need to change the findByIdAndDelete and replace it with remove in our bootcamp controller
BootcampSchema.pre("remove", async function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);
  //only delete courses that are part of the bootcamp being removed
  //so when we use remove we can access the fields, removed bootcamp id using this._id and then match the bootcamp key in courses to the id
  // in the course model the bootcamp will be the id
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});
//Reverse populate with virtuals - create virtuals on schema
//courses is the created name of the field we want to add
BootcampSchema.virtual("courses", {
  ref: "Course", //reference to model we want to use
  localField: "_id",
  foreignField: "bootcamp", //field in the course model we want to pertain to
  justOne: false, //we want to get an array of all the courses for each bootcamp
});
// name of the model is Bootcamp
module.exports = mongoose.model("Bootcamp", BootcampSchema);
