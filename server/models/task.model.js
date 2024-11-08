import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a task title"],
        maxLength: [100, "Title cannot exceed 100 characters"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Please provide task content"],
        maxLength: [1000, "Content cannot exceed 1000 characters"],
    },
    progress: {
        type: String,
        default: 'todo', // Default status will be 'todo'
        enum: ['todo', 'inprogress', 'complete'], // only this should be there.
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchemaV", // ref to attach the user id from user schema
        required: [true, "User ID is required to associate task with user"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true // directly add the createdAt and updatedAt
});



const Task = mongoose.model("TaskSchemaV", taskSchema);
export default Task;
