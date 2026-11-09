import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ride } from "@/lib/models/Ride";
import { User } from "@/lib/models/User";
import { rideSearchSchema, enforceGenderPolicy } from "@/lib/safety";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = rideSearchSchema.parse(payload);

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
        { error: "You must verify your email and student ID to search rides" },
        { status: 403 },
      );
    }

    // Query rides based on search criteria
    const query: any = {
      status: "active",
      "origin.address": { $regex: parsed.origin, $options: "i" },
      "destination.address": { $regex: parsed.destination, $options: "i" },
      availableSeats: { $gt: 0 },
    };

    // Add date filter if provided
    if (parsed.date) {
      const searchDate = new Date(parsed.date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.departureTime = { $gte: searchDate, $lt: nextDay };
    }

    // Apply gender policy filter on backend (critical for safety)
    const genderPolicyFilter: any = {};
    if (parsed.safety.genderPolicy === "women_only") {
      genderPolicyFilter.genderPolicy = { $in: ["any", "women_only"] };
    } else if (parsed.safety.genderPolicy === "same_gender_only") {
      genderPolicyFilter.genderPolicy = "same_gender_only";
    }
    // For "any", no additional filter needed

    query.$and = [genderPolicyFilter];

    const rides = await Ride.find(query)
      .populate("driverId", "firstName lastName rating profileImage")
      .sort({ departureTime: 1 })
      .limit(50);

    // Filter by price range
    const filteredRides = rides.filter(
      (ride) =>
        ride.pricePerSeat >= parsed.filters.priceRange[0] &&
        ride.pricePerSeat <= parsed.filters.priceRange[1] &&
        ride.driverRating >= parsed.filters.driverRating,
    );

    // Format results
    const results = filteredRides.map((ride) => ({
      id: ride._id,
      origin: ride.origin.address,
      destination: ride.destination.address,
      departureTime: ride.departureTime,
      estimatedArrivalTime: ride.estimatedArrivalTime,
      pricePerSeat: ride.pricePerSeat,
      availableSeats: ride.availableSeats,
      totalSeats: ride.totalSeats,
      driver: {
        id: ride.driverId,
        name: `${ride.driverName}`,
        rating: ride.driverRating,
        verified: ride.vehicleInfo?.licensePlate ? true : false,
      },
      safety: {
        genderPolicy: ride.genderPolicy,
      },
      amenities: ride.amenities,
      rules: ride.rules,
    }));

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Invalid search payload" },
      { status: 400 },
    );
  }
}
