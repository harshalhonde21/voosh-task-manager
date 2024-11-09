import bcrypt from "bcryptjs";
import User from "../models/auth.model.js";
import { createToken } from "../middlewares/auth.middleware.js";
import cloudinary from "../config/cloudinary.js";


export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const profilePictureFile = req.file;

        if ([firstName, lastName, username, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for existing user by email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        let profilePictureUrl;

        if (profilePictureFile) {
            profilePictureUrl = await cloudinary.uploader.upload(profilePictureFile.path);
        } else {
            profilePictureUrl = { secure_url: "https://i.ibb.co/Z6NfMT0/DJRINSIL92500011-01-1.webp" }; 
        }

        // Create the user
        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashPassword,
            profilePicture: profilePictureUrl.secure_url,
        });

        const token = createToken(user._id, user.email);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            token,
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter the credentials",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = createToken(user._id, user.email);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const isLogin = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(200).json({
                success: true,
                isLogin: false,
            });
        }

        res.status(200).json({
            success: true,
            isLogin: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const firebaseAuth = async (req, res) => {
    try {
        const { email, name, picture } = req.user; 

        let user = await User.findOne({ email });

        const password = Math.random().toString(36).slice(-8);
        
        if (user) {
            // If the user already exists, update their profile picture and name if necessary
            user.profilePicture = picture || user.profilePicture;
            user.firstName = name.split(" ")[0] || user.firstName;
            user.lastName = name.split(" ")[1] || user.lastName;
        } else {
            // If the user does not exist, create a new user entry
            user = new User({
                firstName: name.split(" ")[0], // Extract first name
                lastName: name.split(" ")[1], // Extract last name
                username: name.split(" ")[0] + name.split(" ")[1], // Combine first and last name for a default username
                email: email,
                profilePicture: picture, 
                googleId: req.user.uid, 
                password
            });
        }

        await user.save();

        const token = createToken(user._id, user.email);

        res.status(200).json({
            message: "User authenticated and saved",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            token, 
        });
    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};
  