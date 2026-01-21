import mongoose from "mongoose";
import { Schema } from "mongoose"

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
  },
  img: {
    type: String,
  },
  hashedPassword: {
    type: String,
    required: true
  },
},
  {
    timestamps: true
  })

export default mongoose.model("User", userSchema)