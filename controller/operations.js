const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const Message = require("../models/messageModel")
const cloudinary = require("cloudinary")
const Career = require("../models/CerrerModel")

const transPorter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "sales@divypower.com",
        pass: process.env.SMTP_PASS
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

        // Upload image to Cloudinary
        const result = await cloudinary.v2.uploader.upload(image.path, {
            folder: "profile_pics",
            resource_type: "raw", // ✅ force raw
        });

        console.log("Before Save");

        // Send mail
        await transPorter.sendMail({
            from: "sales@divypower.com",
            to: "sales@divypower.com", // your admin email
            subject: "Electricity Bill Submission Form ",
            text: `Name: ${name}\nEmail: ${email}\nPhone No: ${phoneNo}\nMessage: ${message}\nbillFile:${result.secure_url}`,
        });


        // ✅ Send acknowledgment email to the user
        await transPorter.sendMail({
            from: "sales@divypower.com",
            to: email,
            subject: "Thank you for contacting us!",
            text: `Thank you for contacting Divy Power. Our Team will Get back to you soon`,
        });

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




exports.CareerApi = async (req, res) => {
    try {
        const { FirstName, LastName, email, Phone, Position, message } = req.body;
        const image = req.file;

        if (!FirstName || !LastName || !email || !Phone || !Position || !message) {
            return res.status(200).json({
                success: false,
                message: "Please Provide add Fields"
            })
        }

        const result = await cloudinary.v2.uploader.upload(image.path, {
            folder: "profile_pics",
            resource_type: "raw", // ✅ force raw
        });

        // console.log(result.secure_url)
        console.log("Before Save");


        await transPorter.sendMail({
            from: "sales@divypower.com",
            to: "sales@divypower.com",
            subject: " Career Form Submission",
            text: `FirstName: ${FirstName}\nEmail: ${email}\nPhone No: ${Phone}\nMessage: ${message}\nPosition :${Position}\n CV :${result.secure_url}`,
        });


        // ✅ Send acknowledgment email to the user
        await transPorter.sendMail({
            from: "sales@divypower.com",
            to: email,
            subject: "Thank you for contacting us!",
            text: `Thank you for contacting Divy Power. Our Team will Get back to you soon`,
        });

        // Save to DB
        await Career.create({
            FirstName,
            LastName,
            email,
            Phone,
            Position,
            message,
            CV: result.secure_url,
        });

        console.log("After Save");

        return res.status(200).json({
            success: true,
            message: " SubMited Career successfully",
        });

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in sending Career "
        })
    }
}


exports.contact = async (req, res) => {
    try {
        const { name, email, phoneNo, message } = req.body

        await Message.create({
            name,
            email,
            phoneNo,
            message,
        });

        await transPorter.sendMail({
            from: "sales@divypower.com",
            to: "sales@divypower.com",
            subject: " Contact Us Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone No: ${phoneNo}\nMessage: ${message}}`,
        });


        // ✅ Send acknowledgment email to the user
        await transPorter.sendMail({
            from: "sales@divypower.com",
            to: email,
            subject: "Thank you for contacting us!",
            text: `Thank you for contacting Divy Power. Our Team will Get back to you soon`,
        });

        return res.status(200).json({
            success: true,
            message: "SubMited sucessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error in Contact"
        })
    }
}