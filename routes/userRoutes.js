import express from 'express';
import { getUser } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/data', userAuth, getUser);

export default userRouter;
