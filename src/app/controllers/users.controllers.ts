import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Models
const User = require("../../models/User");

module.exports = {
  index(req: Request, res: Response) {
    res.status(200).json({ msg: "Bem vindo" });
  },

  //Register User
  async register(req: Request, res: Response) {
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
  },
  //login user
  async login(req: Request, res: Response) {
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
  },
};
