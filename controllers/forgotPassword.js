// Importing necessary modules and models
const User = require("../models/userDb");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Forgotpassword = require("../models/forgotpassword");
var nodemailer = require('nodemailer');

// Retrieving environment variables
const NODE_MAILER_EMAIL = process.env.NODE_MAILER_EMAIL;
const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD;
const secret = process.env.SECRET_KEY;
const WEBSITE = process.env.WEBSITE;

// Controller function for handling GET request to the forgot password page
exports.forgotPasswordGet = (req, res) => {
    res.sendFile("forgotpassword.html", { root: "views" });
}

// Controller function for handling POST request to initiate the forgot password process
exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    try {
        // Finding the user in the database
        const oldUser = await User.findOne({
            where: {
                email: email,
            }
        });

        // If the user is not found
        if (!oldUser) {
            return res.status(404).json({ "message": "User not found" });
        }

        // If the user is found, create a unique ID using uuid.v4() for the forgot password entry
        const id = uuid.v4();

        // Create a new entry in the forgotpassword table with the generated ID and isActive set to true
        await oldUser.createForgotpassword({
            id: id,
            isActive: true
        });

        // Create a JWT token for more secure authentication
        const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, { expiresIn: "10m" });

        // Construct the link with the generated ID and token
        const link = `${WEBSITE}/resetpassword/${id}/${token}`;

        // Create a nodemailer transporter for sending emails
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: NODE_MAILER_EMAIL, // User's email
                pass: NODE_MAILER_PASSWORD // User's email password
            }
        });

        // Create options for the email interface
        var mailOptions = {
            from: 'souvik8582@gmail.com',
            to: oldUser.email,
            subject: 'kotha barta Reset password mail',
            text: "Reset your password",
            html: `<p>Reset your password</p><a href=${link}>Reset password</a>`,
        };

        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        // Send a response indicating success
        res.status(200).send(link);

    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

// Controller function for handling GET request to the reset password page
exports.resetPasswordGet = async (req, res) => {
    const { id, token } = req.params;

    try {
        // Find the forgotpassword entry based on the provided ID
        const forgotpassword = await Forgotpassword.findOne({
            where: {
                id: id,
                isActive: true,
            }
        });

        // If no entry is found, the link is expired
        if (!forgotpassword) {
            return res.status(401).send(`<html><h1>Link expired</h1><a href="/">Home</a></html>`);
        }

        // Deactivate the forgotpassword entry
        await forgotpassword.update({
            isActive: false
        });

        try {
            // Verify the JWT token
            const verify = jwt.verify(token, secret);

            // Send the reset password page
            res.status(200).sendFile("changepassword.html", { root: "views" });

        } catch (tokenError) {
            // Handle token verification error
            return res.status(401).json({ message: "Expired token" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controller function for handling POST request to reset the user's password
exports.resetPasswordPost = async (req, res) => {
    const { id, token } = req.params;

    try {
        // Find the forgotpassword entry based on the provided ID
        const forgotpassword = await Forgotpassword.findOne({
            where: {
                id,
            },
        });

        // If no entry is found, return a 404 error
        if (!forgotpassword) {
            return res.status(404).json({ message: "Reset entry not found" });
        }

        // Find the user associated with the forgotpassword entry
        const oldUser = await User.findOne({
            where: {
                id: forgotpassword.UserId,
            },
        });

        // If no user is found, return a 404 error
        if (!oldUser) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            // Verify the JWT token
            const verify = jwt.verify(token, secret);

            // Get the new password and confirmPassword from the request body
            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;

            // Check if the passwords match
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Password and confirmPassword do not match" });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user's password in the database
            await User.update(
                {
                    password: hashedPassword,
                },
                {
                    where: {
                        id: oldUser.id,
                    },
                }
            );

            // Send a success response
            res.status(200).json({ message: "Password reset successfully" });
        } catch (tokenError) {
            // Handle token verification error
            console.error("Token Verification Error:", tokenError);
            return res.status(401).json({ message: "Token verification failed" });
        }
    } catch (error) {
        // Handle server error
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message });
    }
};
