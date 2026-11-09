import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ride } from "@/lib/models/Ride";
import { User } from "@/lib/models/User";
import { Booking } from "@/lib/models/Booking";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const createRideSchema = z.object({
  origin: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  destination: z.object({
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  departureTime: z.string(),
  totalSeats: z.number().min(1).max(8),
  pricePerSeat: z.number().min(0),
  genderPolicy: z.enum(["any", "women_only", "same_gender_only"]),
  amenities: z
    .object({
      airConditioning: z.boolean().optional(),
      aux: z.boolean().optional(),
      charger: z.boolean().optional(),
      wifi: z.boolean().optional(),
    })
    .optional(),
  rules: z
    .object({
      smokingAllowed: z.boolean().optional(),
      petsAllowed: z.boolean().optional(),
      luggage: z.boolean().optional(),
    })
    .optional(),
  notes: z.string().optional(),
});

// GET - Get ride details
export async function GET(
  request: NextRequest,
  context?: { params?: { rideId?: string } },
) {
  try {
    await connectDB();

    const rideId = context?.params?.rideId || request.nextUrl.searchParams.get("rideId");

    if (!rideId) {
      return NextResponse.json(
        { error: "Ride ID is required" },
        { status: 400 },
      );
    }

    const ride = await Ride.findById(rideId)
      .populate("driverId", "firstName lastName rating profileImage")
      .populate("bookings");

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(ride, { status: 200 });
  } catch (error) {
    console.error("Get ride error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ride" },
      { status: 500 },
    );
  }
}

// POST - Create a new ride
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createRideSchema.parse(body);

    await connectDB();

    // Get driver details
    const driver = await User.findById(authUser.userId);
    if (!driver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is a driver (dynamically upgrade role if passenger)
    if (driver.role !== "driver") {
      driver.role = "driver";
      await driver.save();
    }

    // Create ride
    const ride = new Ride({
      driverId: authUser.userId,
      driverName: `${driver.firstName} ${driver.lastName}`,
      driverGender: driver.gender,
      driverRating: driver.rating,
      vehicleInfo: {
        make: "",
        model: "",
        year: new Date().getFullYear(),
        color: "",
        licensePlate: "",
      },
      origin: {
        address: data.origin.address,
        coordinates: {
          latitude: data.origin.latitude,
          longitude: data.origin.longitude,
        },
      },
      destination: {
        address: data.destination.address,
        coordinates: {
          latitude: data.destination.latitude,
          longitude: data.destination.longitude,
        },
      },
      departureTime: new Date(data.departureTime),
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,
      pricePerSeat: data.pricePerSeat,
      genderPolicy: data.genderPolicy,
      amenities: data.amenities || {},
      rules: data.rules || {},
      notes: data.notes,
      status: "active",
      passengers: [],
      bookings: [],
    });

    await ride.save();

    return NextResponse.json(
      {
        message: "Ride created successfully",
        ride,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create ride error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create ride" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rideId, status } = body;

    if (!rideId || !status) {
      return NextResponse.json(
        { error: "Ride ID and status are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, driverId: authUser.userId },
      { status },
      { new: true }
    );

    if (!ride) {
      return NextResponse.json({ error: "Ride not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ride status updated successfully", ride }, { status: 200 });
  } catch (error) {
    console.error("Update ride error:", error);
    return NextResponse.json(
      { error: "Failed to update ride status" },
      { status: 500 }
    );
  }
}
