//jshint esversion:6
import express from "express";
import ejs from "ejs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
