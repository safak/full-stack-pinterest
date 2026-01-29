import Comment from "../models/comment.model.ts"

export const createComment = async (req: any, res: any) => {
  const { pin, description, user, likes } = req.body
  const newComment = new Comment({
    pin,
    description,
    user,
    likes: likes?.length ? likes : []
  })
  await newComment.save()
  return res.status(201).json({ message: "Comment created successfully", data: newComment })
}

export const updateComment = async (req: any, res: any) => {
  const { commentId } = req.params
  const { pin, description, user, likes } = req.body

  const existingComment = await Comment.findById(commentId)
  if (!existingComment) {
    return res.status(404).json({ message: "Comment not found" })
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      pin: pin ?? existingComment.pin,
      description: description ?? existingComment.description,
      user: user ?? existingComment.user,
      likes: likes.length ? likes : existingComment.likes
    },
    { new: true }
  )

  return res.status(200).json({ message: "Comment updated successfully", data: updatedComment })
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

export const deleteComment = async (req: any, res: any) => {
  const { commentId } = req.params
  const existingComment = await Comment.findById(commentId)
  if (!existingComment) {
    return res.status(404).json({ message: "Comment not found" })
  }
  await Comment.findByIdAndDelete(commentId)
  return res.status(200).json({ message: "Comment deleted successfully" })
}
