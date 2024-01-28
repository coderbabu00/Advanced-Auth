const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
const User = require('../models/user');
const errorHandler = require('../utils/errorHandler');

dotenv.config();
const router = express.Router();

// OTP generating function
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    }
});

// User Registration (Sign Up)
router.post('/register', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            next(errorHandler(400, "User already exists"));
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Creating user with hashed Password
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // Saving the user to the database
        await newUser.save();

        // Generating OTP
        const otp = generateOTP();

        // Saving the OTP to User Model
        newUser.otp = otp;
        await newUser.save();

        // Sending OTP to user via email
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: newUser.email,
            subject: 'Verify your email',
            html: `<p>OTP for your email verification is: ${otp}</p>`,
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        next(err);
    }
});

// User email verification (OTP verification)
router.post("/verify-email", async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // We will find user on basis of email
        const user = await User.findOne({ email });

        // If user is not present
        if (!user) {
            next(errorHandler(404, "User not found"));
        }

        // Compare OTP with stored OTP
        if (user.otp === otp) {
            // Setting the verified status to true
            user.verified = true;

            // Remove the stored/Saved OTP(we are removing it so that if user wants to reset the password then he will get the OTP again)
            user.otp = undefined;

            // Saving the user
            await user.save();

            return res.status(200).json({ message: "Email verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (err) {
        next(err);
    }
});

//User Login
router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if(!user) {
            next(errorHandler(404, "User not found"));
        }

        //  Check if user is verified or not
        if(!user.verified) {
            next(errorHandler(400, "Please verify your email first"));
        }

        // Compare Password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if(!passwordMatch) {
            next(errorHandler(400, "Invalid credentials"));
        }

        // Creating JWT For Authentication
        const token = jwt.sign({ userId:user._id}, process.env.JWTSEC, {expiresIn: '1h'});

        // const { password, ...others } = user._doc;

        return res.status(200).json({ message: "Login successful", token });
    }catch(err){
        next(err);
    }
})

// Reset Password request
router.post("/forgot-password", async (req, res, next) => {
    try {
        const { email } = req.body;

        //Finding user
        const user = await User.findOne({ email });
   
        //  If user is not present
        if (!user) {
            next(errorHandler(404, "User not found"));
        }

    //  Generating unique token for reset password
    const resetToken = crypto.randomBytes(32).toString("hex");

    //Saving the reset token to the user model
    user.resetToken = resetToken;

    //Saving the changes
    await user.save();

    // Sending the reset token to the user via email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">yahan</a> par jakar apna password reset karein.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Password reset email sent. Check your email.' });
    }catch(err){
        next(err);
    }
});

//Password reset 
router.post("/reset-password", async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        //Finding user on basis of reset token
        const user = await User.findOne({ resetToken });

        if(!user){
            next(errorHandler(404, "User not found"));
        }

        // Hashing the new Password
        const hashedPassword=await bcrypt.hash(newPassword, 10);

        // Updating the password of user
        user.password = hashedPassword;

        // Removing the reset token
        user.resetToken = undefined;

        //Saving the changes
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    }catch(err){
        next(err);
    }
})

module.exports = router;
