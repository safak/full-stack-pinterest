import Comment from "../models/comment.model.ts"

export const getComments = async (req: any, res: any) => {
  const comments = await Comment.find()
  return res.status(200).json({ message: "Comments fetched successfully", data: comments })
}

