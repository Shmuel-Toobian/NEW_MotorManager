const express = require("express");
const {capturePayment} = require("../Controller/paymentController");
const router = express.Router();

router.post("/pay/:user_id", capturePayment);

module.exports = router;