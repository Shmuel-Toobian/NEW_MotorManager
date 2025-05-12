const express = require("express");
const router = express.Router();
const { adminAuthenticationMiddleware } = require("../middlewares/authMiddleware");
const {getUser, signUp, login, deleteCookie, getAllUsers, updatePassword, deleteUser} = require("../Controller/userController");
const { logout } = require("../logOut");

router.post('/signup', signUp)
router.post('/login', login)
router.get("/user", getUser);
router.get("/renters",getAllUsers);
router.post('/logout', deleteCookie)
router.post('/updatePassword', updatePassword)
router.delete('/:id', deleteUser)
router.delete('/logout', logout);




module.exports = router;