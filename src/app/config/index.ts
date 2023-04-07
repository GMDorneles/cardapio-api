import { Express } from "express";
import connectToMongoDB from "../database";
import appMiddlewares from "./middleware";

export default function appConfig(app: Express): void {
  appMiddlewares(app);
  connectToMongoDB(app);
}
