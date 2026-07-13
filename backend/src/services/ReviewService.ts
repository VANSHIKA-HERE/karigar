import Review from "../models/Review";
import { Booking } from "../models/Booking";
import { Worker } from "../models/Worker";
import { Types } from "mongoose";

export class ReviewService {
  /**
   * Add review for a completed booking
   */
  async addReview(
    bookingId: string,
    customerId: string,
    rating: number,
    title: string,
    comment: string,
    details?: {
      cleanliness?: number;
      punctuality?: number;
      professionalism?: number;
      communication?: number;
      quality?: number;
      tags?: string[];
    }
  ) {
    // Verify booking exists and is completed
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.customerId.toString() !== customerId) {
      throw new Error("Unauthorized: Only booking customer can review");
    }

    if (booking.status !== "completed") {
      throw new Error("Cannot review incomplete booking");
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      throw new Error("Review already exists for this booking");
    }

    // Create review
    const review = await Review.create({
      bookingId: new Types.ObjectId(bookingId),
      customerId: new Types.ObjectId(customerId),
      workerId: booking.workerId,
      rating,
      title,
      comment,
      cleanliness: details?.cleanliness,
      punctuality: details?.punctuality,
      professionalism: details?.professionalism,
      communication: details?.communication,
      quality: details?.quality,
      tags: details?.tags,
      isVerified: true,
    });

    // Update booking with review ID and rating
    booking.workerReviewId = review._id;
    booking.workerRating = rating;
    await booking.save();

    // Update worker's average rating
    await this.updateWorkerRating(booking.workerId.toString());

    return review.populate("customerId", "firstName lastName profileImage");
  }

  /**
   * Get reviews for a worker
   */
  async getReviews(
    workerId: string,
    page: number = 1,
    limit: number = 20,
    sortBy: "recent" | "rating-high" | "rating-low" = "recent"
  ) {
    const skip = (page - 1) * limit;

    let sort: any = { createdAt: -1 };
    if (sortBy === "rating-high") sort = { rating: -1 };
    if (sortBy === "rating-low") sort = { rating: 1 };

    const [reviews, total] = await Promise.all([
      Review.find({
        workerId: new Types.ObjectId(workerId),
        isDeleted: false,
        isVerified: true,
      })
        .populate("customerId", "firstName lastName profileImage")
        .populate("bookingId", "serviceTitle")
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Review.countDocuments({
        workerId: new Types.ObjectId(workerId),
        isDeleted: false,
        isVerified: true,
      }),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Update worker's average rating based on all reviews
   */
  private async updateWorkerRating(workerId: string) {
    const reviews = await Review.find({
      workerId: new Types.ObjectId(workerId),
      isDeleted: false,
      isVerified: true,
    });

    if (reviews.length === 0) {
      return;
    }

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const worker = await Worker.findById(workerId);
    if (worker) {
      worker.averageRating = Math.round(averageRating * 10) / 10; // Round to 1 decimal
      worker.totalReviews = reviews.length;
      await worker.save();
    }
  }

  /**
   * Delete review (soft delete)
   */
  async deleteReview(reviewId: string, customerId: string) {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.customerId.toString() !== customerId) {
      throw new Error("Unauthorized: Only review author can delete");
    }

    review.isDeleted = true;
    review.deletedAt = new Date();
    await review.save();

    // Update worker rating
    await this.updateWorkerRating(review.workerId.toString());

    return review;
  }
}

export default new ReviewService();
