const mongoose = require('mongoose');
exports.dbConnect = async () => {

    mongoose.connect("mongodb://localhost:27017/solar").then(() => {
        console.log("MongoDB Connected");
    })
        .catch((err) => {
            console.log("MongoDB Connection Error: ", err);
        });
}