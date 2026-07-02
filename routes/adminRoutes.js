const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")

const {register,login,createReceptionist} = require("../controllers/adminController");

router.post("/register", register);
router.post("/login", login);

router.post("/create_receptionist",auth(["admin"]), createReceptionist);

module.exports = router;