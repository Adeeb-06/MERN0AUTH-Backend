import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const registr = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(404).json({ message: "All fields are required" });
    }
    try {

        const existingUser = await userModel.findOne({ email });

        if(existingUser) {
            return res.status(401).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Welcome to Our Service",
            text: `Hello ${name},\n\nThank you for registering with us! Your account has been created successfully.\n\nBest regards,\nYour Service Team`
        }

        await transporter.sendMail(mailOptions);

        res.cookie('token', token)

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: "All fields are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token)

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}




export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified) {
            return res.status(400).json({ message: "Account already verified" });
        } else{
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

            user.verifyOtp = otp;
            user.verifyOtpExpiry = expiry;
            await user.save();

            const mailOptions = {
                from: process.env.SENDER_MAIL,
                to: user.email,
                subject: "Account Verification OTP",
                text: `Your OTP for account verification is ${otp}. It is valid for 10 minutes.`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "OTP sent successfully" });
        }


    } catch (error) {
        console.error("Error sending verification OTP:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const verifyEmail = async (req, res) => {
    const { userId ,otp } = req.body;
    

    if (!userId || !otp) {
        return res.status(404).json({ message: "Missing details" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(user.verifyOtp==="" || user.verifyOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (Date.now() > user.verifyOtpExpiry) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiry = 0;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(404).json({ message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.resetOtp = otp;
        user.resetOtpExpiry = expiry;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending reset OTP:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(404).json({ message: "All fields are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
            
        }

        if (Date.now() > user.resetOtpExpiry) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiry = 0;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}