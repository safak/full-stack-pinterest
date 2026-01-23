import User from "../models/user.model.ts"
import Follow from "../models/follow.model.ts"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

export const getUser = async (req: any, res: any) => {
  const id = req.params?.id || req.query?.id
  if (!id) return res.status(400).json({ message: "Missing pin id." })

  const user = await User.findById(id)
  if (!user) return res.status(404).json({ message: "User not found." })
  const { hashedPassword, ...otherUserDetails } = user.toObject()
  const followers = await Follow.countDocuments({ following: user._id })
  const following = await Follow.countDocuments({ follower: user._id })

  const token = req.cookies?.token || ""
  if (!token) {
    return res.status(200).json({ message: "User fetched successfully.", data: { ...otherUserDetails, followers, following, isFollowing: false } })
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
      const userId = (decoded as any).id
      const isFollowing = await Follow.exists({
        follower: userId,
        following: user._id
      })
      const userDetails = {
        ...otherUserDetails, followers, following, isFollowing: !!isFollowing
      }
      return res.status(200).json({ message: "User fetched successfully.", data: userDetails })
    } catch (error) {
      return res.status(200).json({ message: "User fetched successfully.", data: { ...otherUserDetails, followers, following, isFollowing: false } })
    }
  }
}

export const getUsers = async (req: any, res: any) => {
  const user = await User.find()
  return res.status(200).json({ message: "Users fetched successfully.", data: user })
}

export const updateUser = async (req: any, res: any) => {
  const userId = req.query("id")
  const user = req.body

  const existingUser = await User.findById(userId)
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" })
  }

  let hashedPassword = ""
  if (user?.password) {
    hashedPassword = await bcrypt.hash(user.password, 10)
  }

  const newUser = await User.updateOne({ _id: userId }, {
    ...user,
    hashedPassword: hashedPassword || existingUser.hashedPassword
  })

  return res.status(201).json({ message: "User updated successfully.", newUser })
}

export const deleteUser = async (req: any, res: any) => {
  const userId = req.query("id")

  await User.deleteOne({ _id: userId })

  return res.status(200).json({ message: "User deleted successfully." })
}

export const followUser = async (req: any, res: any) => {
  const { username } = req.params

  const user = await User.findOne({ username })

  if (!user) return res.status(404).json({ message: "User not found." })

  const isFollowing = await Follow.exists({
    follower: req.userId,
    following: user._id
  })
  if (isFollowing) {
    await Follow.deleteOne({
      follower: req.userId,
      following: user._id
    })
  }
  else {
    const newFollow = new Follow({
      follower: req.userId,
      following: user._id
    })
    await newFollow.save()
  }

  return res.status(200).json({ message: "Following successfully updated." })
}