const express = require("express");
const { addCar, getCars, updateCar, deleteCar, getPendingWashRentals, updateCarWashStatus } = require("../Controller/carController");
const { adminAuthenticationMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.post('/' ,adminAuthenticationMiddleware , addCar)
// router.get('/',  getCars)
// router.put('/:carNumber', adminAuthenticationMiddleware, updateCar)
// router.delete('/:carNumber', adminAuthenticationMiddleware , deleteCar)

router.post('/'  , addCar)
router.get('/',  getCars)
router.put('/:carNumber', updateCar)
router.delete('/:carNumber' , deleteCar)


router.get('/wash',  getPendingWashRentals)
router.put('/wash/:carNumber',updateCarWashStatus )



module.exports = router;