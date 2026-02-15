import mongoose from "mongoose";
import { Schema } from "mongoose"

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pin: {
    type: Schema.Types.ObjectId,
    ref: "Pin",
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }]
},
  {
    timestamps: true
  }
)

export default mongoose.model("Comment", commentSchema)