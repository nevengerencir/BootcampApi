const express = require("express");
const router = express.Router();
const User = require("../models/User");

const advancedResults = require("../middelware/advancedResult");
const { protect, authorize } = require("../middelware/auth");

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} = require("../controlers/users");

router.use(protect); // instead of chaining protect before every Middelware
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:id").delete(deleteUser).put(updateUser).get(getUser);

module.exports = router;
