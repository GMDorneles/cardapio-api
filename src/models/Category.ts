const mongooseCategory = require("mongoose");

const Category = mongooseCategory.model(
  "Category",
  new mongooseCategory.Schema({
    name: String,
    Products: [
      {
        type: mongooseCategory.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  })
);

module.exports = Category;
