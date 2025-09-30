import nodemailer from 'nodemailer';

export const sendOtp = async (email, otp) => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: email,
            subject: 'BC Traders - Your OTP Code',
            text: `Your OTP code is ${otp}`
        });
    } catch (error) {

    }
}