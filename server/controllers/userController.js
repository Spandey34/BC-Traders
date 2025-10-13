import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '3d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 100, // 30 days
    });
};

const userDetails = async (req, res) => {
    try {
        const { name, email, clerkId, phoneNumber, role, profilePic } = req.body;

        if (!clerkId) {
            return res.status(401).json({ message: "Unauthorized: Not LoggedIn!" });
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            const newUser = await User.create({
                name: name,
                email: email,
                clerkId: clerkId,
                phoneNumber: phoneNumber,
                profilePic: profilePic || ""
            });

            // Generate JWT and set it as a cookie for the new user
            generateToken(res, newUser._id, newUser.role);

            return res.status(201).json({ user: newUser });
        } else {
            if (phoneNumber && user.phoneNumber !== phoneNumber) {
                user.phoneNumber = phoneNumber;
                await user.save();
            }

            // Generate JWT and set it as a cookie for the existing user
            generateToken(res, user._id, user.role);

            return res.status(200).json({ user });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error: Could not process user details." });
    }
}



export { userDetails };
