const mongooseProducts = require("mongoose");

const Products = mongooseProducts.model(
  "Products",
  new mongooseProducts.Schema({
    name: String,
    qty: Number,
    price: Number,
    categories: [
      {
        type: mongooseProducts.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  })
);
module.exports = Products;
