import userModel from "../models/user.js";

export const getUser = async (req, res) => {
    try {
        const {userId } = req.body;
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, 
            userData:{
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
         });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        
    }
}