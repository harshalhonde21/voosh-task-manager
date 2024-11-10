import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import admin from "../config/firebaseAdmin.js";

import dotenv from 'dotenv';
dotenv.config();

export const createToken = (id, email) => {
    const token = jwt.sign(
        {
            id,
            email,
        },
        process.env.SECRET,
        {
            expiresIn: "5d",
        }
    );

    return token;
};

export const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                isLogin: false,
                message: "Missing Token",
            });
        }

        jwt.verify(token, process.env.SECRET, async (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    isLogin: false,
                    message: err.message,
                });
            }

            req.user = await User.findById(user.id);
            next();
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const checkAuth = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token not provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach decoded token to request object
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};