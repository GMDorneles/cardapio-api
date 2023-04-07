import express from "express";

const routes = express.Router();

const Users = require("../controllers/users.controllers");

routes.get("/", Users.index);
routes.post("/auth/register", Users.register);
routes.post("/auth/login", Users.login);

module.exports = routes;
