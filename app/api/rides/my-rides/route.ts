import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ride } from "@/lib/models/Ride";
import { Booking } from "@/lib/models/Booking";
import { User } from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get rides posted by user (driver)
    const drivingRides = await Ride.find({ driverId: authUser.userId })
      .sort({ departureTime: -1 })
      .populate("bookings");

    // Get rides booked by user (passenger)
    const passengerRides = await Ride.find({
      passengers: authUser.userId,
    }).sort({ departureTime: -1 });

    return NextResponse.json(
      {
        driving: drivingRides,
        booked: passengerRides,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get my rides error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rides" },
      { status: 500 },
    );
  }
}
