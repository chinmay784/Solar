const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const { sendResponse, CareerApi, contact } = require('../controller/operations');
const router = express.Router();
const { upload } = require("../config/cloudinary")
const { toWords } = require("number-to-words");
const nodeMailer = require('nodemailer');

const transPorter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: "ondkopuwcqizcqqu"
  },
});

router.post("/senddata", upload.single("billFile"), sendResponse);
router.post("/CareerApi", upload.single("CV"), CareerApi)
router.post("/contact", contact)



router.post('/submit', async (req, res) => {
  try {
    const { bill } = req.body;
    const savings_per_kw = 1191;
    const cost_per_kw = 85185;
    const central_subsidy_per_kw = 26888;
    const state_subsidy_fixed = 30000;
    const roof_area_per_kw = 60;

    const system_size = +(bill / savings_per_kw).toFixed(2);
    const roof_area = Math.round(system_size * roof_area_per_kw);
    const total_cost = Math.round(system_size * cost_per_kw);
    const central_subsidy = Math.round(system_size * central_subsidy_per_kw);
    const net_cost = total_cost - central_subsidy - state_subsidy_fixed;
    const monthly_saving = Math.round(system_size * savings_per_kw);
    const lifetime_saving = 964892;
    const roi = +((lifetime_saving / net_cost) / 25 * 100).toFixed(2);

    // const calculation = new Calculation({
    //   bill, system_size, roof_area, total_cost, net_cost, monthly_saving, roi
    // });
    // await calculation.save();

    res.json({ system_size, roof_area, total_cost, net_cost, monthly_saving, roi });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'Failed to Calculate Cost', details: error.message });
  }
});


router.post("/subScribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Send mail
    await transPorter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Subscription Confirmation',
      text: 'Thank you for subscribing to SolarHayFynix updates!'
    });

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      sucess: false,
      message: "Subscribe Error"
    })
  }
})

module.exports = router;