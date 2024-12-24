const express = require("express");
const { addCar, getCars, updateCar, deleteCar } = require("../Controller/carController");
const router = express.Router();

router.post('/' , addCar)
router.get('/', getCars)
router.put('/:carNumber', updateCar)
router.delete('/:carNumber', deleteCar)


module.exports = router;