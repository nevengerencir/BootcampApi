const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require("../controlers/auth");
const { protect } = require("../middelware/auth");
const router = express.Router();

router.post("/register", register).post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);

module.exports = router;
