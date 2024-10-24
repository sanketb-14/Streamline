import express from "express";

import bcrypt from "bcryptjs";
import User from "../models/User.js";


const router = express.Router();

import {
  register,
  login,
  protect,
  restrict,
  logout,
} from "../controllers/authController.js";
import { getMe, updateMe, deleteMe,getAllUser, uploadUserPhot, resizeUserPhot } from "../controllers/userController.js";

router.post('/test-password', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  res.json({
      status: 'success',
      data: {
          passwordMatches: isMatch,
          providedPassword: password,
          hashedPassword: user.password
      }
  });
});

router.post("/register", register);

router.post("/login", login);



router.use(protect)
router.get("/", restrict("admin") ,getAllUser)
router.get("/logout",  logout);

router.get("/", getMe);

router.patch("/updateMe",uploadUserPhot, resizeUserPhot, updateMe);
router.delete("/deleteMe", deleteMe);


// Add this temporary test route to your auth routes



export default router;
