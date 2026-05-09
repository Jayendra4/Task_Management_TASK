import express from "express";
import {
  addTask,
  editTask,
  deleteTask,
  toggleTaskStatus,
  getAllTasks,
  verifyToken,
} from "../controller/task.controller.js";

const router = express.Router();


router.get("/", verifyToken, getAllTasks);


router.post("/add", verifyToken, addTask);


router.put("/edit/:id", verifyToken, editTask);


router.delete("/delete/:id", verifyToken, deleteTask);


router.patch("/toggle/:id", verifyToken, toggleTaskStatus);

export default router;
