import jwt from "jsonwebtoken"

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.cookies?.token || ""
  if (!token) {
    return res.status(401).json({ message: "Not authenticated." })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.userId = (decoded as any).id
    next()
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." })
  }
}

export default verifyToken