import Comment from "../models/comment.model.ts"

export const createComment = async (req: any, res: any) => {
  const { pin, description, user } = req.body
  const newComment = new Comment({
    pin,
    description,
    user
  })
  await newComment.save()
  return res.status(201).json({ message: "Comment created successfully", data: newComment })
}

export const getComments = async (req: any, res: any) => {
  const comments = await Comment.find()
  return res.status(200).json({ message: "Comments fetched successfully", data: comments })
}

export const getPinComments = async (req: any, res: any) => {
  const { pinId } = req.params
  const comments = await Comment.find({ pin: pinId }).populate("user", "username img displayName").sort({ createdAt: -1 })
  return res.status(200).json({ message: "Comments fetched successfully", data: comments })
}

