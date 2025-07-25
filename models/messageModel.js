const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    billFile:{
        type:String
    }
}, { timestamps: true });   

module.exports = mongoose.model('Message', messageSchema);