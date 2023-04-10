const mongooseCategory = require("mongoose");

const Category = mongooseCategory.model(
  "Category",
  new mongooseCategory.Schema({
    name: String,
  })
);

module.exports = Category;
