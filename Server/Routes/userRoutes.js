const express = require("express");
const router = express.Router();
const {getUser, signUp, login, deleteCookie} = require("../Controller/userController")

router.post('/signup', signUp)
router.post('/login', login)
router.get("/user", getUser);
router.post('/logout', deleteCookie)

module.exports = router;