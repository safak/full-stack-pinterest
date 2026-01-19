import mongoose from "mongoose"
const uri = process.env.MONGO_DB_URI

async function connectDB() {
  try {
    await mongoose.connect(uri ?? "");
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error while connecting to the database", err);

    throw err
  }
}

export default connectDB
