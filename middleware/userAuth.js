import jwt from "jsonwebtoken";

const userAuth = async(req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id){
            req.body.userId = decoded.id;
        }else{
            return res.status(401).json({ message: "Unauthorized access" });
        }
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(403).json({ message: "Invalid token" });
    }
}

export default userAuth;