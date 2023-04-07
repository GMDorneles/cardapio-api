import express from "express";
import appConfig from "./src/app/config";

const app = express();

appConfig(app);
