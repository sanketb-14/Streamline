import express from "express";
const router = express.Router();

import {
  register,
  login,
  protect,
  restrict,
  logout,
  googleSignIn,
} from "../controllers/authController.js";
import {
  getMe,
  updateMe,
  deleteMe,
  getAllUser,
  uploadUserPhoto,
} from "../controllers/userController.js";

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post('/google', googleSignIn)



// Protected Routes
router.use(protect);
router.get("/logout", logout);
router.get("/me", getMe);
router.patch("/updateMe", uploadUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

// Admin Routes
router.get("/", restrict("admin"), getAllUser);

export default router;