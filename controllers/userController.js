import userModel from "../models/user.js";
import jwt from 'jsonwebtoken';


export const getUser = async (req, res) => {
    try {
        const {userId} = req.body; // ✅ Properly getting it from middleware

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID missing" });
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, userData: user });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
