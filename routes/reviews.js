const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/Review");

const advancedResult = require("../middelware/advancedResult");
const { protect, authorize } = require("../middelware/auth");

const { getReviews, getReview } = require("../controlers/reviews");

router
  .route("/")
  .get(
    advancedResult(Review, { path: "bootcamp", select: "name description" }),
    getReviews
  );
router.route("/:id").get(getReview);

module.exports = router;
