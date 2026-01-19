import mongoose from "mongoose";
import { Schema } from "mongoose"

const boardSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
},
  {
    timestamps: true
  })

export default mongoose.model("Board", boardSchema)