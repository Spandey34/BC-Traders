import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const userMiddleware = async (req, res, next)=>
{
   try {
    const token = req.cookies.jwt;
    if(!token)
    {
        return res.status(401).json({message: "Unauthorized: No token provided"});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if(!user)
    {
        return res.status(401).json({message: "Unauthorized: User not found"});
    }

    if(user.role !== "user")
    {
        return res.status(403).json({message: "Forbidden: Access is denied"});
    }

    next();

   } catch (error) {
    console.log(error);
    return res.status(401).json({message: "Unauthorized: Invalid token"});
   }
}

export default userMiddleware;