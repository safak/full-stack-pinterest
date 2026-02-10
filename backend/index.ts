import express from "express"
import cors from "cors"
import userRouter from "./routes/user.route.ts"
import authRouter from "./routes/auth.route.ts"
import pinRouter from "./routes/pin.route.ts"
import commentRouter from "./routes/comment.route.ts"
import boardRouter from "./routes/board.route.ts"
import imageRouter from "./routes/image.route.ts"
import conversationRouter from "./routes/conversation.route.ts"
import notificationRouter from "./routes/notification.route.ts"
import connectDB from "./db/connectDB.ts"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import http from "http"
import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import { setIO } from "./utils/socket.ts"

const PORT = process.env.PORT || 3000
const CLIENT_URL = process.env.CLIENT_URL!;

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or Postman
      if (!origin) return callback(null, true);

      if (origin === CLIENT_URL) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    // origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // allow common auth headers and the custom X-Request-ID used by the client
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);

app.use(cookieParser())
app.use(fileUpload())
app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/pins", pinRouter)
app.use("/comments", commentRouter)
app.use("/boards", boardRouter)
app.use("/images", imageRouter)
app.use("/conversations", conversationRouter)
app.use("/notifications", notificationRouter)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
})

// store io instance for use in controllers/services
setIO(io)
app.set("io", io)

// simple socket auth: expect token in `handshake.auth.token` or `authorization` header
io.use((socket, next) => {
  try {
    let token = socket.handshake.auth?.token;
    if (!token) {
      const authHeader = socket.handshake.headers?.authorization?.toString();
      if (authHeader) token = authHeader.split(" ")[1];
    }
    // Fallback: try to parse token from cookie header (useful for browser clients with httpOnly cookie)
    if (!token) {
      const cookieHeader = socket.handshake.headers?.cookie as string | undefined;
      if (cookieHeader) {
        const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) return next(new Error("Unauthorized"))
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any
    socket.data.userId = decoded.id
    return next()
  } catch (err) {
    return next(new Error("Unauthorized"))
  }
})

io.on("connection", (socket) => {
  const userId = socket.data.userId
  if (userId) socket.join(userId)
  console.log("Socket connected:", socket.id, "userId:", userId)
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id)
  })
})

  ; (async () => {
    try {
      await connectDB()
      server.listen(PORT, () => {
        console.log("server is running at port", PORT)
      })
    } catch (err) {
      console.error("Failed to start server", err)
      process.exit(1)
    }
  })()