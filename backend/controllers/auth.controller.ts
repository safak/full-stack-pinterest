import User from "../models/user.model.ts"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const expiresIn = "7d"

export const login = async (req: any, res: any) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: "Missing credentials." })

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: "User not found." })

  const isMatch = await bcrypt.compare(password, user.hashedPassword)
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials." })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn })

  const { hashedPassword, ...otherUserDetails } = user.toObject()

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  return res.status(200).json({ message: "Login successfully.", data: { user: otherUserDetails } })
}


export const register = async (req: any, res: any) => {
  const { username, email, password, img, displayName, dob } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use." })
  }

  const existingUserByUsername = await User.findOne({ username })

  if (existingUserByUsername) {
    return res.status(409).json({ message: "Username already in use." })
  }

  const newHashedPassword = await bcrypt.hash(password, 10)

  const modifiedUsername = username.trim().toLowerCase();

  const newUser = await User.create({
    username: modifiedUsername,
    email,
    img: img || "",
    dob: dob || null,
    displayName: displayName || username,
    hashedPassword: newHashedPassword,
  })

  const { hashedPassword, ...otherUserDetails } = newUser.toObject()

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn })

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  return res.status(201).json({ message: "User registered successfully.", data: otherUserDetails })
}

export const logout = async (req: any, res: any) => {
  res.clearCookie("token")
  return res.status(200).json({ message: "Logout successfully." })
}