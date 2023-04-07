import { Router, Request, Response, NextFunction } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const routes = Router();

//Models
const User = require("../../models/User");

routes.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo" });
});

//Private Route

routes.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  if (id.length > 24) {
    return res
      .status(404)
      .json({ msg: "The id must have a maximum of 24 numbers" });
  }
  //check if user exists
  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.status(200).json({ user });
});

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied" });
  }
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({ msg: "Invalid Token!" });
  }
}

//Register User

routes.post("/auth/register", async (req, res) => {
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

routes.post("/auth/login", async (req, res) => {
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

export default routes;
