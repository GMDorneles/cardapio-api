import { Request, Response } from "express";

const Product = require("../../models/Product");
const Category = require("../../models/Category");

module.exports = {
  //create product
  async product(req: Request, res: Response) {
    const { name, qty, price, category } = req.body;

    //check if category exists
    const categoryQty = category.length;
    let categoryExistsQty = 0;

    for (let i = 0; i < categoryQty; i++) {
      let categoryExists = await Category.findById(category[i].id);

      if (categoryExists) {
        categoryExistsQty = categoryExistsQty + 1;
      }
    }

    if (categoryQty < categoryExistsQty) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const createProduct = function (name: string, qty: number, price: number) {
      return Product.create({
        name,
        qty,
        price,
      });
    };

    const product = await createProduct(name, qty, price);
    try {
      await Product.findByIdAndUpdate(
        product._id,
        { $push: { categories: category } },
        { new: true, useFindAndModify: false }
      );

      res.status(201).json({ msg: "Product successfully created!" });
    } catch (err) {
      return res.status(500).json({
        msg: "There was a server error, please try again later!",
      });
    }
  },

  //List product
  async listProduct(req: Request, res: Response) {
    //check if product exists
    const product = await Product.find();

    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }

    res.status(200).json({ product });
  },

  //List product:id
  async listProductById(req: Request, res: Response) {
    const { name, qty, price, category } = req.body;
    const id = req.params.id;
    //check if product exists
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }

    res.status(200).json({ msg: "certo!" });
  },

  //delete product
  async deleteProductById(req: Request, res: Response) {
    const id = req.params.id;
    //check if product exists
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }
    try {
      await Product.deleteOne({ _id: product._id });
      res.status(201).json({ msg: "The product has been deleted!" });
    } catch {
      return res.status(500).json({
        msg: "There was a server error, please try again later!",
      });
    }
  },
};
