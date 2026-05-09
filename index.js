import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "./config/dbConfig.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
const app = express();

const PORT = process.env.PORT || 7000

app.use(cors({
    origin : ["task-management-task-sigma.vercel.app"],
    credentials :true
}));

app.use(express.json())

app.use("/api", userRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/tasks', taskRouter);

app.listen(PORT , ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
