import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const adminMiddleware = async (req, res, next)=>
{
    try {
        const token = req.cookies.jwt;
        if(!token)
        {
            return res.status(401).json({message: "Unauthorized: No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id).select("-password");
        if(!user || user.role !== 'admin')
        {
            return res.status(401).json({message: "Unauthorized: Admins only"});
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "Unauthorized: Invalid token"});
    }
}

export default adminMiddleware;