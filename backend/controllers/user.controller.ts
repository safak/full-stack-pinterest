import User from "../models/user.model.ts"
import Follow from "../models/follow.model.ts"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import ImageKit from "imagekit"

const IK_PUBLIC_KEY = process.env.IK_PUBLIC_KEY
const IK_PRIVATE_KEY = process.env.IK_PRIVATE_KEY
const IK_URL_ENDPOINT = process.env.IK_URL_ENDPOINT

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

    const imagekit = new ImageKit({
      publicKey: IK_PUBLIC_KEY!,
      privateKey: IK_PRIVATE_KEY!,
      urlEndpoint: IK_URL_ENDPOINT!,
    });

    if (existingUser?.img && existingUser.imgFileId && (media || (user && (user.img === null || user.img === 'null')))) {
      // Delete existing image from ImageKit
      imagekit.deleteFile(existingUser.imgFileId, function (error, result) {
        if (error) {
          console.log("Error deleting file:", error);
        }
        else {
          console.log("File deleted successfully:", result);
        }
      });
    }
    if (media) {
      const transformationString = `w-${80},h-${80}`;

      imgUploadResponse = await imagekit
        .upload({
          file: media.data,
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
  }

  return res.status(200).json({ message: "Following successfully updated." })
}