import express from "express";
import {
    registerUser,
    loginUser,
    isLogin,
    firebaseAuth
} from "../controllers/auth.controller.js";
import { isAuthenticated, checkAuth } from "../middlewares/auth.middleware.js";
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();


router.post("/register", upload.single('profilePicture'), registerUser);
router.post("/login", loginUser);
router.post("/firebase-auth", checkAuth, firebaseAuth);
router.get("/isLogin", isAuthenticated, isLogin);

export default router;
