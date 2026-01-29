import mongoose from "mongoose";
import { Schema } from "mongoose"

const imageSchema = new Schema({
  fileId: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  media: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
},
  {
    timestamps: true
  })

export default mongoose.model("Image", imageSchema)