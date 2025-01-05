const express = require("express");
const router = express.Router();
const {getUser, signUp, login, deleteCookie, getAllUsers} = require("../Controller/userController")

router.post('/signup', signUp)
router.post('/login', login)
router.get("/user", getUser);
router.get("/renters", getAllUsers);
router.post('/logout', deleteCookie)

module.exports = router;