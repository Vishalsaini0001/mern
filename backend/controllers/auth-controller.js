const express = require("express");
const userModel = require("../models/user-model");
const mssgeModel = require("../models/contact-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const home = async (req, res) => {
  try {
    res.send("Welcome!");
  } catch (error) {
    console.log("error:", error);
  }
};
const register = async (req, res) => {
  try {
    let { username, email, phone, password } = req.body;
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "user already exists!" });
    }

    const hash_password = await bcrypt.hash(password, 10);

    const createduser = await userModel.create({
      username,
      email,
      phone,
      password: hash_password,
    });
    const token = jwt.sign(
      { email: createduser.email },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("token", token);
    res.status(200).json({ CreatedSuccessfully: createduser, token: token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Invalid email address" });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (!result) {
        res.json({ message: "Incorrect Password" });
      } else {
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET_KEY
        );
        res.cookie("token", token);
        res.status(200).json({
          CreatedSuccessfully: "Login succesfully",
          user,
          token: token,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
const contact = async (req, res) => {
  try {
    let { name, email, message } = req.body;
    const msge = await mssgeModel.create({
      name,
      email,
      message,
    });
    res.json({ message: msge });
  } catch (error) {
    console.log(error);
  }
};

const user = async (req, res) => {
  try {
    const data = req.user;
    res.json({ messgae: data });
  } catch (error) {
    console.log("error from route user", error);
  }
};

module.exports = { home, register, login, contact, user };
