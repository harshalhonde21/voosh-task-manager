import Task from "../models/task.model.js";

// Create Task
export const createTask = async (req, res) => {
    try {
        const { title, content, progress } = req.body;
        const userId = req.user._id; // Assuming the user is authenticated and their ID is in req.user

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newTask = new Task({
            title,
            content,
            progress: progress || 'todo', // Default progress is 'todo'
            userId,
        });

        // Save the task to the database
        await newTask.save();

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Task
export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }

        // Use deleteOne instead of remove
        await task.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Update Task
export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { title, content, progress } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if user is authorized to update the task
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        task.title = title || task.title;
        task.content = content || task.content;
        task.progress = progress || task.progress;

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Change Progress of Task
export const changeProgressOfTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { progress } = req.body;

        if (!['todo', 'inprogress', 'complete'].includes(progress)) {
            return res.status(400).json({ message: "Invalid progress status" });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if user is authorized to update the task
        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to change progress" });
        }

        task.progress = progress;
        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task progress updated successfully",
            task,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Tasks for a User
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        // Group tasks by progress
        const groupedTasks = tasks.reduce((acc, task) => {
            const { progress } = task;
            if (!acc[progress]) {
                acc[progress] = [];
            }
            acc[progress].push(task);
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            tasks: groupedTasks, // Return grouped tasks based on progress
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get Task by Task ID
export const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this task" });
        }

        return res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
