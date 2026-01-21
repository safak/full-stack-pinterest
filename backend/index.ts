import express from "express"
import cors from "cors"
import userRouter from "./routes/user.route.ts"
import authRouter from "./routes/auth.route.ts"
import pinRouter from "./routes/pin.route.ts"
import commentRouter from "./routes/comment.route.ts"
import boardRouter from "./routes/board.route.ts"
import connectDB from "./db/connectDB.ts"

const PORT = process.env.PORT || 3000
const CLIENT_URL = process.env.CLIENT_URL!;

console.log(CLIENT_URL);


const app = express()

app.use(express.json())

app.use(
  cors({
    // origin: (origin, callback) => {
    //   // Allow server-to-server or Postman
    //   if (!origin) return callback(null, true);
    //   console.log(origin, CLIENT_URL);

    //   if (origin === CLIENT_URL) {
    //     return callback(null, true);
    //   }

    //   return callback(new Error("Not allowed by CORS"));
    // },
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // allow common auth headers and the custom X-Request-ID used by the client
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);


app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/pins", pinRouter)
app.use("/comments", commentRouter)
app.use("/boards", boardRouter)

  ; (async () => {
    try {
      await connectDB()
      app.listen(PORT, () => {
        console.log("server is running at port", PORT);
      })
    } catch (err) {
      console.error("Failed to start server", err)
      process.exit(1)
    }
  })()