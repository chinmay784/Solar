const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const Message = require("../models/messageModel")
const cloudinary = require("cloudinary")

const transPorter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: "ondkopuwcqizcqqu"
    },
});


exports.sendResponse = async (req, res) => {
    console.log("Hello");
    try {
        const { name, email, phoneNo, message } = req.body;
        const image = req.file; // assuming single file upload middleware (like multer.single("billFile"))

        if (!name || !email || !phoneNo || !message || !image) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Send mail
        await transPorter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone No: ${phoneNo}\nMessage: ${message}`,
        });

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image.path, {
            folder: "profile_pics",
        });

        console.log("Before Save");

        // Save to DB
        await Message.create({
            name,
            email,
            phoneNo,
            message,
            billFile: result.secure_url,
        });

        console.log("After Save");

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });

    } catch (error) {
        console.error("Error in sendResponse:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};