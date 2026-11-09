import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ride } from "@/lib/models/Ride";
import { User } from "@/lib/models/User";
import { Booking } from "@/lib/models/Booking";
import { enforceGenderPolicy, rideBookingSchema } from "@/lib/safety";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = rideBookingSchema.parse(payload);

    // Authenticate user
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user details
    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user is fully verified
    if (!user.verifiedEmail || !user.verifiedStudentId) {
      return NextResponse.json(
        { error: "You must verify your email and student ID to book rides" },
        { status: 403 },
      );
    }

    // Get ride details
    const ride = await Ride.findById(parsed.rideId).populate("driverId");
    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Check if ride has available seats
    if (ride.availableSeats < parsed.passengerCount) {
      return NextResponse.json(
        { error: "Not enough available seats" },
        { status: 400 },
      );
    }

    // Re-check gender policy restrictions at booking time
    const rideContext = {
      driverId: ride.driverId._id.toString(),
      driverGender: ride.driverGender,
      genderPolicy: ride.genderPolicy,
    };

    enforceGenderPolicy(
      {
        userId: user._id!.toString(),
        verifiedEmail: user.verifiedEmail,
        verifiedStudentId: user.verifiedStudentId,
        gender: user.gender,
      },
      rideContext,
    );

    // Create booking
    const totalPrice = ride.pricePerSeat * parsed.passengerCount;
    const booking = new Booking({
      rideId: parsed.rideId,
      passengerId: user._id,
      driverId: ride.driverId._id,
      passengerCount: parsed.passengerCount,
      totalPrice,
      status: "confirmed",
      paymentStatus: "completed",
      seatNumbers: parsed.seatNumber ? [parsed.seatNumber] : [],
    });

    await booking.save();

    // Update ride availability
    ride.availableSeats -= parsed.passengerCount;
    ride.passengers.push(user._id!.toString());
    ride.bookings.push(booking._id);
    await ride.save();

    // Update user ride count
    user.rideCount += 1;
    await user.save();

    return NextResponse.json(
      {
        bookingId: booking._id,
        rideId: parsed.rideId,
        status: "confirmed",
        totalPrice,
        message: "Booking confirmed successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking error:", error);
    const message = error instanceof Error ? error.message : "Booking failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
