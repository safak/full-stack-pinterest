import mongoose from "mongoose";
import { Schema } from "mongoose"

const pinSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  media: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
  },
  tags: {
    type: [String]
  }


},
  {
    timestamps: true
  })

export default mongoose.model("Pin", pinSchema)