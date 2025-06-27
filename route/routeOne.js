const express = require('express');
const { sendResponse, CareerApi, contact } = require('../controller/operations');
const router = express.Router();
const {upload} = require("../config/cloudinary")

router.post("/senddata",upload.single("billFile"),sendResponse);
router.post("/CareerApi",upload.single("CV"),CareerApi)
router.post("/contact",contact)

module.exports = router;