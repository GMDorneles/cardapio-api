import express, { Express } from "express";
import mongoose = require("mongoose");
require("dotenv").config();

export default function connectToMongoDB(app: Express): void {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASS;

  mongoose
    .connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.8q0aubs.mongodb.net/?retryWrites=true&w=majority`
    )
    .then(() => {
      app.listen(3000);
      console.log("connected");
    })
    .catch((err: Error) => console.log(err));
}
