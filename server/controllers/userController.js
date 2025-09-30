import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import Otp from "../models/otpModel.js";
import bcrypt from "bcrypt";
import {sendOtp} from "../nodemailer/sendOtp.js"

const otpSignup = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(user)
        {
            return res.status(404).json({message: "User Already Exists Login!"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const oldOtp = await Otp.findOne({email});
        if(!oldOtp)
        {
            await Otp.create({email, otp});
            await sendOtp(email, otp);
        }
        else{
            oldOtp.otp = otp;
            await oldOtp.save();
            await sendOtp(email, otp);
        }

        return res.status(200).json({message: "OTP sent to email"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server Error"});
    }
}

const signup = async (req,res) => {
    try {
        const {name, email, password, otp} = req.body;
        const oldOtp = await Otp.findOne({email});
        if(!oldOtp)
        {
            return res.status(400).json({message: "OTP Expired."});
        }
        if(oldOtp.otp !== otp)
        {
            return res.status(400).json({message: "Invalid OTP"});
        }

        const salt = await bcrypt.genSalt(10);

        const hasedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,email,password: hasedPassword
        });
        const secretKey = process.env.JWT_SECRET;

        const token = jwt.sign({user: {id: user._id}}, secretKey);
        res.cookie("BC-Traders", token, {sameSite: 'None', secure: true});
        res.cookie("role", user.role, {sameSite: 'None', secure: true});
        return res.status(201).json({message: "User Created Successfully", role: "user"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server Error"});
    }
}

const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const checkUser = await User.findOne({email});
        if(!checkUser)
        {
            return res.status(404).json({message: "User Not Found! Please Signup"});
        }
        const isMatch = await bcrypt.compare(password, checkUser.password);
        if(!isMatch)
        {
            return res.status(400).json({message: "Wrong Password"});
        }
        const user = await User.findOne({email}).select("-password");
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign({user: {id: user._id}}, secretKey);
        res.cookie("BC-Traders", token, {sameSite: 'None', secure: true});
        res.cookie("role", checkUser.role, {sameSite: 'None', secure: true});
        return res.status(200).json({message: "Login Successful", role: checkUser.role});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server Error"});
    }
}

const forgotPassword = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(404).json({message: "User Not Found! Please Signup"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const oldOtp = await Otp.findOne({email});
        if(!oldOtp)
        {
            await Otp.create({email, otp});
            await sendOtp(email, otp);
        }
        else{
            oldOtp.otp = otp;
            await oldOtp.save();
            await sendOtp(email, otp);
        }
        return res.status(200).json({message: "OTP sent to email"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server Error"});
    }
}

const resetPassword = async (req,res) => {
    try {
        const {email, otp} = req.body;
        const oldOtp = await Otp.findOne({email});
        if(!oldOtp)
        {
            return res.status(400).json({message: "OTP Expired."});
        }
        if(oldOtp.otp !== otp)
        {
            return res.status(400).json({message: "Invalid OTP"});
        }
        const user = await User.findOne({email}).select("-password");

        const token = jwt.sign({user: {id: user._id}}, process.env.JWT_SECRET);
        res.cookie("BC-Traders", token, {sameSite: 'None', secure: true});
        res.cookie("role", user.role, {sameSite: 'None', secure: true});
        return res.status(200).json({message: "OTP Verified"});
    }
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({message: "Server Error"});
    }
}

const home = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

export {otpSignup, signup, login, forgotPassword, resetPassword, home};