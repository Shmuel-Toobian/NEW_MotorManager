const express = require("express");
const router = express.Router();
const userRoutes = require('./userRoutes')
const carRoutes = require('./carRoutes')

router.use("/user", userRoutes)
router.use("/cars", carRoutes)





module.exports = router;