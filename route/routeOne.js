const express = require('express');
const { sendResponse } = require('../controller/operations');
const router = express.Router();
const {upload} = require("../config/cloudinary")

router.post("/senddata",upload.single("billFile"),sendResponse)

module.exports = router;