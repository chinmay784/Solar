const express = require('express');
const { sendResponse, CareerApi, contact } = require('../controller/operations');
const router = express.Router();
const {upload} = require("../config/cloudinary")
const {toWords} = require("number-to-words");

router.post("/senddata",upload.single("billFile"),sendResponse);
router.post("/CareerApi",upload.single("CV"),CareerApi)
router.post("/contact",contact)


function calculateOutputs(estimatedKW, electricityBill, peakSunHours, continuousLoadKW) {
  const unitsPerDay = estimatedKW * peakSunHours;
  const monthlyUnits = unitsPerDay * 30;
  const avgRate = electricityBill / monthlyUnits;
  const monthlySaving = avgRate * monthlyUnits;
  const yearlySaving = monthlySaving * 12;
  const savings25YearsValue = Math.round(yearlySaving * 25);

  const degradationFactor = 0.9375;
  const weatherFactor = 0.90;
  const finalEfficiency = degradationFactor * weatherFactor;

  const adjustedMonthlyGeneration = Math.round(estimatedKW * peakSunHours * 30 * finalEfficiency);
  const totalPowerSaved = adjustedMonthlyGeneration * 12 * 25;

  const co2Saved = Math.round(monthlyUnits * 0.92 * 12 * 25 / 1000); // in tons
  const treesSaved = Math.round(co2Saved * 0.8);
  const waterSaved = Math.round(monthlyUnits * 2 * 12 * 25); // in liters

  return {
    savings25Years: `₹${savings25YearsValue}`,
    savingsInWords: `${toWords(savings25YearsValue)} Rupees`,
    co2Saved: `${co2Saved} tons`,
    treesSaved: `${treesSaved} trees`,
    waterSaved: `${waterSaved} liters`,
    adjustedMonthlyGeneration: `${adjustedMonthlyGeneration} kWh/month`,
    totalPowerSaved: `${totalPowerSaved} kWh over 25 years`
  };
}

router.post('/submit', async (req, res) => {
  try {
    const {
      electricityBill,
      roofArea,
      state,
      district,
      peakSunHours,
      roofType,
      phoneNumber,
      meterKW,
      meterConnection,
      continuousLoadKW
    } = req.body;

    const estimatedKW = Math.round((roofArea / 100) * 100) / 100;
    const results = calculateOutputs(estimatedKW, electricityBill, peakSunHours, continuousLoadKW);
    res.status(201).json({ message: 'Data saved successfully', results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save entry', details: error.message });
  }
});

module.exports = router;