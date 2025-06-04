const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const { dbConnect } = require('./dataBase/db');
const routeONN = require("./route/routeOne")
const app = express();
const PORT = 3000;


app.use(cors({  origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


dbConnect()
app.use("/api", routeONN);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} http://localhost:${PORT}`);
});
