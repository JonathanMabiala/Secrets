//jshint esversion:6
import 'dotenv/config';
import express from "express";
import ejs from "ejs";
import { dbConnect } from "./db/db.js";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

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

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

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
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({
    email: username,
    password: password,
  });

  newUser.save().then((result) => {
    console.log(result);
  });

  res.render("secrets");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }).then((foundUser) => {
    if (!foundUser) {
      console.log("user not found");
    } else {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.render("login", { message: "username or password incorect" });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
