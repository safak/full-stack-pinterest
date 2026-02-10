import { toFile } from "@imagekit/nodejs"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import Follow from "../models/follow.model.ts"
import User from "../models/user.model.ts"
import { createNotificationService } from "../services/notificationService.ts"
import { getImagekitClient, optimizeImageBuffer } from "../utils/image.ts"

export const getUser = async (req: any, res: any) => {
  const id = req.params?.id || req.query?.id
  if (!id) return res.status(400).json({ message: "Missing user id." })

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
  const q = req?.query?.q
  let query = {}
  if (q && typeof q === "string") {
    query = {
      $or: [
        { username: { $regex: q, $options: "i" } },
        { displayName: { $regex: q, $options: "i" } }
      ]
    }
  }

  const user = await User.find(query).select("-hashedPassword")
  return res.status(200).json({ message: "Users fetched successfully.", data: user })
}

export const updateUser = async (req: any, res: any) => {
  const userId = req.userId
  const user = req.body
  const media = req?.files?.media;
  let imgUploadResponse: any = null;

  if (!user && !media) {
    return res.status(400).json({ message: "No data provided for update." })
  }

  try {
    const existingUser = await User.findById(userId)
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const imagekit = getImagekitClient();


    if (existingUser?.img && existingUser.imgFileId && (media || (user && (user.img === null || user.img === 'null')))) {
      // Delete existing image from ImageKit
      await imagekit.files.delete(existingUser.imgFileId);
    }
    if (media) {
      const { buffer } = await optimizeImageBuffer(media.data as Buffer);
      const transformationString = `w-${80},h-${80}`;
      const file = await toFile(buffer, media.name || "image");
      imgUploadResponse = await imagekit.files
        .upload({
          file: file,
          fileName: media.name,
          folder: "user-images",
          transformation: {
            pre: transformationString,
          },
        })
    }

    let hashedPassword = ""
    if (user?.password) {
      hashedPassword = await bcrypt.hash(user.password, 10)
    }

    const newUser = await User.findByIdAndUpdate(userId, {
      displayName: user?.displayName || existingUser.displayName,
      hashedPassword: hashedPassword || existingUser.hashedPassword,
      imgFileId: imgUploadResponse ? imgUploadResponse.fileId : (user?.img === null || user?.img === 'null' ? undefined : existingUser.imgFileId),
      img: imgUploadResponse ? imgUploadResponse.url : (user?.img === null || user?.img === 'null' ? "" : existingUser.img),
    }, { new: true })

    return res.status(201).json({ message: "User updated successfully.", data: newUser })
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Error updating user:", error });
  }
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
    const notificationPayload = {
      sender: req.userId,
      receiver: user._id,
      type: "FOLLOW",
      entityId: user._id,
      entityType: "User",
      message: `Someone started following you.`,
    };
    await createNotificationService(notificationPayload);
  }

  return res.status(200).json({ message: "Following successfully updated." })
}