const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a title for the review"],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, "Please add a some text"],
    },
    rating: {
      type: Number,
      required: [true, "Please add number of weeks"],
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bootcamp",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
//Prevent user from submiting more than one review
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get average rating

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};
// call getAverageCost after save !!! difference in static and methods !!!
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
