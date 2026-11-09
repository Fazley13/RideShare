import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Review } from "@/lib/models/Review";
import { User } from "@/lib/models/User";
import { Booking } from "@/lib/models/Booking";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createReviewSchema = z.object({
  rideId: z.string(),
  bookingId: z.string(),
  revieweeId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  categories: z
    .object({
      communication: z.number().min(1).max(5).optional(),
      cleanliness: z.number().min(1).max(5).optional(),
      driving: z.number().min(1).max(5).optional(),
      safety: z.number().min(1).max(5).optional(),
    })
    .optional(),
  type: z.enum(["driver_review", "passenger_review"]),
});

// GET - Get reviews for a user
export async function GET(
  request: NextRequest,
  context?: { params?: { userId?: string } },
) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    let userId = searchParams.get("userId") || context?.params?.userId;

    if (!userId) {
      try {
        const authUser = await requireAuth(request);
        if (authUser) {
          userId = authUser.userId;
        }
      } catch (e) {
        // Ignore auth error, just don't filter by userId if not authenticated
      }
    }

    const query: any = {};

    if (userId) {
      query.revieweeId = userId;
    }

    const reviews = await Review.find(query)
      .populate("reviewerId", "firstName lastName profileImage")
      .populate("revieweeId", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    // Calculate average rating
    let avgRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      avgRating = Math.round((totalRating / reviews.length) * 10) / 10;
    }

    return NextResponse.json(
      {
        reviews,
        averageRating: avgRating,
        totalReviews: reviews.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createReviewSchema.parse(body);

    await connectDB();

    // Check if booking exists and user was part of it
    const booking = await Booking.findById(data.bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify user is part of this booking
    if (
      booking.passengerId.toString() !== authUser.userId &&
      booking.driverId.toString() !== authUser.userId
    ) {
      return NextResponse.json(
        { error: "Unauthorized to review this booking" },
        { status: 403 },
      );
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      rideId: data.rideId,
      bookingId: data.bookingId,
      reviewerId: authUser.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this ride" },
        { status: 400 },
      );
    }

    // Create review
    const review = new Review({
      rideId: data.rideId,
      bookingId: data.bookingId,
      reviewerId: authUser.userId,
      revieweeId: data.revieweeId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      categories: data.categories,
      type: data.type,
    });

    await review.save();

    // Update user rating
    const reviews = await Review.find({ revieweeId: data.revieweeId });
    if (reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await User.findByIdAndUpdate(data.revieweeId, {
        rating: Math.round(avgRating * 10) / 10,
      });
    }

    return NextResponse.json(
      {
        message: "Review created successfully",
        review,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create review error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a review (only by reviewer)
export async function DELETE(
  request: NextRequest,
  context?: { params?: { reviewId?: string } },
) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const reviewId = context?.params?.reviewId || request.nextUrl.searchParams.get("reviewId");
    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check authorization
    if (review.reviewerId.toString() !== authUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Review.findByIdAndDelete(reviewId);

    // Recalculate user rating
    const reviews = await Review.find({ revieweeId: review.revieweeId });
    if (reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await User.findByIdAndUpdate(review.revieweeId, {
        rating: Math.round(avgRating * 10) / 10,
      });
    } else {
      await User.findByIdAndUpdate(review.revieweeId, {
        rating: 5,
      });
    }

    return NextResponse.json(
      {
        message: "Review deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
