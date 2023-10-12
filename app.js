//jshint esversion:6
import "dotenv/config";
import express from "express";
import ejs from "ejs";
import { dbConnect } from "./db/db.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//Connect to DB
dbConnect();

//Setup userSchema and Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });

    newUser.save().then((result) => {
      console.log(result);
    });

    res.render("secrets");
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }).then((foundUser) => {
    if (!foundUser) {
      console.log("user not found");
    } else {
      bcrypt.compare(
        req.body.password,
        foundUser.password,
        function (err, result) {
          if (result) {
            res.render("secrets");
          } else {
            res.render("login", { message: "username or password incorect" });
          }
        }
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
