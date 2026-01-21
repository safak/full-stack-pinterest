import User from "../models/user.model.ts"
import bcrypt from 'bcryptjs'

export const getUser = async (req: any, res: any) => {
  const id = req.params?.id || req.query?.id
  if (!id) return res.status(400).json({ message: "Missing pin id." })

  const user = await User.findById(id)
  if (!user) return res.status(404).json({ message: "User not found." })
  const { hashedPassword, ...otherUserDetails } = user.toObject()

  return res.status(200).json({ message: "User fetched successfully.", data: otherUserDetails })
}

export const getUsers = async (req: any, res: any) => {
  const user = await User.find()
  return res.status(200).json({ message: "Users fetched successfully.", data: user })
}

export const updateUser = async (req: any, res: any) => {
  const userId = req.query("id")
  const user = req.body
  let hashedPassword = ""
  if (user?.password) {
    hashedPassword = await bcrypt.hash(user.password, 10)
  }

  const newUser = await User.updateOne({ _id: userId }, {
    ...user,
  })

  return res.status(201).json({ message: "User updated successfully.", newUser })
}

export const deleteUser = async (req: any, res: any) => {
  const userId = req.query("id")

  await User.deleteOne({ _id: userId })

  return res.status(200).json({ message: "User deleted successfully." })
}