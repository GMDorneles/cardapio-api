import express from "express";
import { checkToken } from "../utils/checkToken";

const routes = express.Router();

const Users = require("../controllers/users.controllers");
const Category = require("../controllers/category.controllers");
const Product = require("../controllers/products.controllers");

routes.get("/", Users.index);
routes.post("/auth/register", Users.register);
routes.post("/auth/login", Users.login);
routes.post("/category", checkToken, Category.createCategory);
routes.get("/category", Category.category);
routes.get("/product", Product.product);

module.exports = routes;
