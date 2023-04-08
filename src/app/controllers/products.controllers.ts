import { Request, Response } from "express";

const Product = require("../../models/Product");
const Category = require("../../models/Category");

module.exports = {
  //create product
  async product(req: Request, res: Response) {
    const { name, qty, price, category } = req.body;

    if (category.length > 24) {
      return res
        .status(404)
        .json({ msg: "The id must have a maximum of 24 numbers" });
    }

    //check if user exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const product = new Product({
      name,
      qty,
      price,
    });
    console.log(category);
    console.log(product._id);
    try {
      await product.save();
      Product.findByIdAndUpdate(
        product._id,
        { category: category },
        { new: true, useFindAndModify: false }
      );

      Category.findByIdAndUpdate(
        category,
        { $push: { products: product._id } },
        { new: true, useFindAndModify: false }
      );

      res.status(201).json({ msg: "category successfully created!" });
    } catch (err) {
      return res.status(500).json({
        msg: "There was a server error, please try again later!",
      });
    }
  },
};
