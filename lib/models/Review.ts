import mongoose from "mongoose";

export interface IReview {
  _id?: string;
  rideId: mongoose.Types.ObjectId | string;
  bookingId: mongoose.Types.ObjectId | string;
  reviewerId: mongoose.Types.ObjectId | string;
  revieweeId: mongoose.Types.ObjectId | string;
  rating: number;
  title?: string;
  comment?: string;
  categories?: {
    communication: number;
    cleanliness: number;
    driving: number;
    safety: number;
  };
  type: "driver_review" | "passenger_review";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    rideId: {
      type: String,
      required: true,
      ref: "Ride",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Booking",
    },
    reviewerId: {
      type: String,
      required: true,
      ref: "User",
    },
    revieweeId: {
      type: String,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: String,
    comment: String,
    categories: {
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },
      driving: {
        type: Number,
        min: 1,
        max: 5,
      },
      safety: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    type: {
      type: String,
      enum: ["driver_review", "passenger_review"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
