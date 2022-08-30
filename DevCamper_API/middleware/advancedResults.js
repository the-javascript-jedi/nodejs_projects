// we put a function inside a function
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // Copy of request.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create Query String
  // we create a new query string and add the "$" operator to the front because it becomes a mongoose operator - create operators ($gt,$gte,etc)
  let queryStr = JSON.stringify(reqQuery);
  // replace takes a regular expression
  // b - word boundary character,/ g is global
  // we will match for greater than greater than equal to and in is used for searching a list/array
  //second argument match returns the argument with a $ sign
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // console.log("queryStr", queryStr);
  // Finding Resource
  // we can do a reverse populate by adding the created virtual schema present in Bootcamp schema
  query = model.find(JSON.parse(queryStr));
  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    //console.log("fields", fields); //select=name,description - name description
    //query.select is a mongoose function for searching the mongo collection
    query = query.select(fields);
  }
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // default sortBy date
    query = query.sort("-createdAt");
  }
  // Pagination
  // we want the page no as number parsint() second parameter radix as 10
  //default page value is 1 if no values are passed
  const page = parseInt(req.query.page, 10) || 1;
  //limit displays the data per page
  const limit = parseInt(req.query.limit, 10) || 100;
  // startIndex - query .skip to skip a certain amount of resources/bootcamps
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  // total amount of documents
  //.countDocuments() is a mongoose method used to count all the documents
  const total = await model.countDocuments();
  //.query.skip(100).limit(20) - Specifies the number of documents to skip.
  //this can be used to go to next page-it skips the said records
  query = query.skip(startIndex).limit(limit);
  // add populate-- if something is passed into populate, we will add populate and whatever is passed into populate
  if (populate) {
    query = query.populate(populate);
  }
  // Executing our Query
  // return all bootcamps without any filters
  // const bootcamps = await Bootcamp.find();
  // return bootcamps with a filter search - averageCost[lte]=10000, averageCost[gt]=5000
  const results = await query;
  // Pagination Result
  const pagination = {};
  // if on first page don't show previous button, if on last page don't show the last button
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  // create an object to return the response
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  // call next since this is middleware
  next();
};
module.exports = advancedResults;
