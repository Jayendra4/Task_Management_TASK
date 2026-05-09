import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected....");
  })
  .catch((err) => {
    console.log("failed connection", err);
  });

export default mongoose;