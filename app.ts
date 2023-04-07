import express from "express";
require("dotenv").config();
import mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

//Config JSON response
app.use(express.json());

//Models
const User = require("./models/User");

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Teste" });
});

//Register User

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  //validations
  if (!name) {
    return res.status(422).json({ msg: "Name is required" });
  }

  if (!email) {
    return res.status(422).json({ msg: "Email is required" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password is required" });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "The passwords don't match" });
  }

  //check if user exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "The email is already registered" });
  }

  //create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //create user

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "User successfully created!" });
  } catch (err) {
    res.status(500).json({
      msg: "There was a server error, please try again later!",
    });
  }
});

//login user

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  //validations
  if (!email) {
    return res.status(422).json({ msg: "Email is required" });
  }

  if (!password) {
    return res.status(422).json({ msg: "Password is required" });
  }

  //check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "The email is not registered" });
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Invalid password" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    res.status(200).json({ msg: "authentication was successful!", token });
  } catch (err) {
    res.status(500).json({
      msg: "There was a server error, please try again later!",
    });
  }
});
//credentials
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
