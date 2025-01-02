const express = require("express");
const { addCar, getCars, updateCar, deleteCar } = require("../Controller/carController");
const { adminAuthenticationMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/' ,adminAuthenticationMiddleware , addCar)
router.get('/',  getCars)
router.put('/:carNumber', adminAuthenticationMiddleware, updateCar)
router.delete('/:carNumber', adminAuthenticationMiddleware , deleteCar)


module.exports = router;