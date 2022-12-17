const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logOut,
} = require("../controlers/auth");
const { protect } = require("../middelware/auth");
const router = express.Router();

router.post("/register", register).post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", protect, logOut);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
module.exports = router;
