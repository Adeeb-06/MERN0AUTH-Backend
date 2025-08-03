import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

dotenv.config({ path: './config.env' });

const app = express();

connectDB();

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.use('/api/auth', authRouter);




app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});