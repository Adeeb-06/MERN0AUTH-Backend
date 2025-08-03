import express from "express";
import { login, logout, registr, sendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post('/register', registr);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-email', userAuth, verifyEmail);



export default authRouter;