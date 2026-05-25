
import express from "express";
import { 
  signup, 
  login, 
  getMe, 
  googleLogin, 
  verifyGoogleOTP, 
  resendOTP,
  forgotPassword,
  resetPassword 
} from "../controllers/authController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyGoogleOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, getMe);

export default router;
