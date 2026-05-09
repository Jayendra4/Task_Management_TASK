import Task from "../models/task.model.js";
import jwt from "jsonwebtoken";
import secretKey from "../config/authConfig.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, secretKey.secret_jwt, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Get all tasks for the logged-in user
export const getAllTasks = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = { userId: req.user.id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Add Task
export const addTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    
    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId: req.user.id
    });
    
    await task.save();
    res.status(201).json({ message: "Task added successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error: error.message });
  }
};

// Edit Task
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, status } = req.body;
    
    let updateData = { title, description, priority, dueDate, status };
    
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// Toggle Task Status
export const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();
    
    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task status", error: error.message });
  }
};
