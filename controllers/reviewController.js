import Review from "../models/review.js";
import House from "../models/House.js";

export const createReview = async (req, res) => {
  try {
    const { houseId, rating, comment } = req.body;

    const house = await House.findOne({ homeId: houseId });

    if (!house) {
      return res.json({
        status: 0,
        message: "House not found"
      });
    }

    const review = await Review.create({
      user: req.user._id.toString(),
      house: houseId,
      rating,
      comment
    });

    res.json({
      status: 1,
      data: review
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.json({
        status: 0,
        message: "You already reviewed this house"
      });
    }

    res.json({
      status: 0,
      message: error.message
    });
  }
};
// Get Review off House

export const getHouseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ house: req.params.houseId });

    res.json({
      status: 1,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.json({ status: 0, message: "Review not found" });
    }

    if (
      review.user !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.json({ status: 0, message: "Not authorized" });
    }

    await review.deleteOne();

    res.json({
      status: 1,
      message: "Review deleted"
    });

  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.json({
        status: 0,
        message: "Review not found"
      });
    }

    // Only owner or admin can update
    if (
      review.user !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.json({
        status: 0,
        message: "Not authorized to update this review"
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.json({
      status: 1,
      data: review
    });

  } catch (error) {
    res.json({
      status: 0,
      message: error.message
    });
  }
};
