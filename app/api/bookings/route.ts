import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/lib/models/Booking";
import { Ride } from "@/lib/models/Ride";
import { User } from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const updateBookingSchema = z.object({
  status: z.enum(["confirmed", "pending", "completed", "cancelled"]).optional(),
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .optional(),
  cancellationReason: z.string().optional(),
});

// GET - Get booking details
export async function GET(
  request: NextRequest,
  context?: { params?: { bookingId?: string } },
) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const bookingId = context?.params?.bookingId || request.nextUrl.searchParams.get("bookingId");

    if (!bookingId) {
      // Get all bookings for current user
      const bookings = await Booking.find({
        $or: [{ passengerId: authUser.userId }, { driverId: authUser.userId }],
      })
        .populate("rideId")
        .populate("passengerId", "firstName lastName profileImage")
        .populate("driverId", "firstName lastName profileImage")
        .sort({ createdAt: -1 });

      return NextResponse.json({ bookings }, { status: 200 });
    }

    const booking = await Booking.findById(bookingId)
      .populate("rideId")
      .populate("passengerId", "firstName lastName profileImage")
      .populate("driverId", "firstName lastName profileImage");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check authorization
    if (
      booking.passengerId.toString() !== authUser.userId &&
      booking.driverId.toString() !== authUser.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}

// PUT - Update booking status
export async function PUT(
  request: NextRequest,
  context?: { params?: { bookingId?: string } },
) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = updateBookingSchema.parse(body);

    await connectDB();

    const bookingId = context?.params?.bookingId || request.nextUrl.searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check authorization - only driver or passenger can update
    if (
      booking.passengerId.toString() !== authUser.userId &&
      booking.driverId.toString() !== authUser.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update booking
    if (data.status) {
      booking.status = data.status;
      if (data.status === "completed") {
        booking.completedAt = new Date();
      } else if (data.status === "cancelled") {
        booking.cancelledAt = new Date();
        booking.cancellationReason = data.cancellationReason;

        // Refund seats to ride
        const ride = await Ride.findById(booking.rideId);
        if (ride) {
          ride.availableSeats += booking.passengerCount;
          // Remove passenger from ride
          ride.passengers = ride.passengers.filter(
            (p: any) => p.toString() !== booking.passengerId.toString(),
          );
          await ride.save();
        }
      }
    }

    if (data.paymentStatus) {
      booking.paymentStatus = data.paymentStatus;
    }

    await booking.save();

    return NextResponse.json(
      {
        message: "Booking updated successfully",
        booking,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(
  request: NextRequest,
  context?: { params?: { bookingId?: string } },
) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const bookingId = context?.params?.bookingId || request.nextUrl.searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check authorization
    if (
      booking.passengerId.toString() !== authUser.userId &&
      booking.driverId.toString() !== authUser.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Cancel booking
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.paymentStatus = "refunded";
    await booking.save();

    // Refund seats to ride
    const ride = await Ride.findById(booking.rideId);
    if (ride) {
      ride.availableSeats += booking.passengerCount;
      ride.passengers = ride.passengers.filter(
        (p: any) => p.toString() !== booking.passengerId.toString(),
      );
      await ride.save();
    }

    return NextResponse.json(
      {
        message: "Booking cancelled successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 },
    );
  }
}
