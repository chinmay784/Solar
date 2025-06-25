const mongoose = require("mongoose");


const CareerSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        unique: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Phone: {
        type: String,
        required: true,
    },
    Position: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    // PortfolioLink: {
    //     type: String,
    //     required: true,
    // },
    CV:{
        type: String,
        required: true
    }
})


module.exports = mongoose.model("Career",CareerSchema)