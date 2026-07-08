const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")

const {register,login,createReceptionist,createServiceAdvisor} = require("../controllers/adminController");

router.post("/register", register);
router.post("/login", login);

router.post("/create_receptionist",auth(["admin"]), createReceptionist);

router.post("/create_service_advisor",auth(["admin"]),createServiceAdvisor);

module.exports = router;