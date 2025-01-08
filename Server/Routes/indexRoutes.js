const express = require("express");
const router = express.Router();
const userRoutes = require('./userRoutes')
const carRoutes = require('./carRoutes')
const paymentRoutes = require('./paymentRoutes')

router.use("/user", userRoutes)
router.use("/cars", carRoutes)
router.use("/payment", paymentRoutes)





module.exports = router;