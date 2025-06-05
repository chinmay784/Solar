const mongoose = require('mongoose');
exports.dbConnect = async () => {

    mongoose.connect("mongodb+srv://chinmaypuhan420:7QP8Ok8HTHoELT8N@solarcluster.lifqqud.mongodb.net/SolarDivya").then(() => {
        console.log("MongoDB Connected");
    })
        .catch((err) => {
            console.log("MongoDB Connection Error: ", err);
        });
}