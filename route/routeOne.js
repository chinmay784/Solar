const express = require('express');
const { sendResponse } = require('../controller/operations');
const router = express.Router();


router.post("/senddata",sendResponse)

module.exports = router;