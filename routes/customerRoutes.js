const express = require("express");
const router = express.Router();

const { register,login,getProfile,changePassword} = require("../controllers/customerController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile",auth(["customer"]), getProfile)
router.put("/change_password",auth(["customer"]),changePassword);

module.exports = router;