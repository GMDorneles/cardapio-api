import { Request, Response } from "express";

const Category = require("../../models/Category");

module.exports = {
  //Create Category
  async createCategory(req: Request, res: Response) {
    const { name } = req.body;

    const category = new Category({
      name,
    });

    try {
      await category.save();
      res.status(201).json({ msg: "category successfully created!" });
    } catch (err) {
      res.status(500).json({
        msg: "There was a server error, please try again later!",
      });
    }
  },

  //List Category
  async category(req: Request, res: Response) {
    //check if category exists
    const category = await Category.find();

    if (!category) {
      return res.status(404).json({ msg: "category not found" });
    }

    res.status(200).json({ category });
  },
};
