import cors from "cors";
import express, { Express } from "express";
const routes = require("../../routes");

export default function appMiddlewares(app: Express): void {
  app.use(cors());
  //Config JSON response
  app.use(express.json());
  app.use(routes);
}
