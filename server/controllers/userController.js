import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const home = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

const userDetails = async (req,res) => {
    try {
        const clerkId = req.body.clerkId;
        if(!clerkId)
        {
            return res.status(401).json({message: "Unauthorized: Not LoggedIn!"});
        }
        const user = await User.findOne({clerkId: clerkId});
        if(!user)
        {
            const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                clerkId: clerkId
            });
            return res.status(201).json({user: newUser});
        }
        return res.status(200).json({user});
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "Unauthorized: Invalid ClerkId"});
    }
}

export {home, userDetails};