import express from "express";
import { login, logout, registr } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/register', registr);
authRouter.post('/login', login);
authRouter.post('/logout', logout);


export default authRouter;