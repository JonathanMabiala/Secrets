import mongoose from "mongoose";

/**
 * Create a DB connection with mongoose
 * URI: mongodb://127.0.0.1:27017/userBD
 */
const uri = "mongodb://127.0.0.1:27017/userDB";
export function dbConnect() {
  mongoose.connect(uri);
}
