const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/Review");

const advancedResult = require("../middelware/advancedResult");
const { protect, authorize } = require("../middelware/auth");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controlers/reviews");

router
  .route("/")
  .get(
    advancedResult(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);

module.exports = router;
