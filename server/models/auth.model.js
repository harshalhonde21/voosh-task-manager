import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
        maxLength: [30, "First name cannot exceed 30 characters"],
        minLength: [2, "First name should have more than 2 characters"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
        maxLength: [30, "Last name cannot exceed 30 characters"],
        minLength: [2, "Last name should have more than 2 characters"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true,
        maxLength: [20, "Username cannot exceed 20 characters"],
        minLength: [4, "Username should have more than 4 characters"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        select: false // Excludes password when fetching user documents
    },
    profilePicture: {
        type: String,
        default: "https://i.ibb.co/Z6NfMT0/DJRINSIL92500011-01-1.webp" // Default profile picture url before login user.
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows the field to be optional while remaining unique
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // It directly add the createdAt and updatedAt to object(particular user schema)
});

const User = mongoose.model("UserSchemaV", userSchema);
export default User;


