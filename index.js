import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "./config/dbConfig.js";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
const app = express();

const PORT = process.env.PORT || 7000

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json())

app.use("/api", userRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/tasks', taskRouter);

app.listen(PORT , ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
