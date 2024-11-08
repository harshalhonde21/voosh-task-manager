import express from "express";
import {
    createTask,
    deleteTask,
    updateTask,
    changeProgressOfTask,
    getAllTasks,
    getTaskById
} from "../controllers/task.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Task Routes
router.post("/create-task", isAuthenticated, createTask); // Create a task
router.delete("/delete-task/:taskId", isAuthenticated, deleteTask); // Delete a task
router.put("/update-task/:taskId", isAuthenticated, updateTask); // Update a task
router.put("/progress-change/:taskId/progress", isAuthenticated, changeProgressOfTask); // Change task progress
router.get("/getAllTasks", isAuthenticated, getAllTasks); // Get all tasks
router.get("/getTaskById/:taskId", isAuthenticated, getTaskById); // Get task by task ID

export default router;
