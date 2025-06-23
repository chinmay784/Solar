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
    console.log("Hello")
    try {
        const { name, email, phoneNo, message , billFile } = req.body;
        const image = req.files;
        if (!name || !email || !phoneNo || !message || !billFile) {
            return res.status(200).json({
                success: false,
                message: "All fields are required",
            })
        }

        await transPorter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone No: ${phoneNo}\nMessage: ${message}`,
        })

        const result = await cloudinary.uploader.upload(image.path, {
            folder: "profile_pics",
        });
        let images = result.secure_url
        // imageUrls.push(result.secure_url);
        console.log("Before Save")
        await Message.create({
            name,
            email,
            phoneNo,
            message,
            billFile:images
        });
         console.log("After Save")
        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });

    } catch (error) {
        console.error("Error in sendResponse:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}