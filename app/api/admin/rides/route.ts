import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Ride } from "@/lib/models/Ride";
import { User } from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

async function checkAdminAccess(request: NextRequest) {
  const authUser = await requireAuth(request);
  if (!authUser) {
    return null;
  }

  await connectDB();
  const user = await User.findById(authUser.userId);
  if (!user || user.role !== "admin") {
    return null;
  }

  return authUser;
}

const updateRideSchema = z.object({
  status: z.enum(["active", "completed", "cancelled"]).optional(),
});

// GET - Get all rides
export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdminAccess(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const rides = await Ride.find(query)
      .populate("driverId", "firstName lastName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Ride.countDocuments(query);

    return NextResponse.json(
      {
        rides,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get rides error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rides" },
      { status: 500 },
    );
  }
}

// PUT - Update ride status
export async function PUT(
  request: NextRequest,
  context?: { params?: { rideId?: string } },
) {
  try {
    const admin = await checkAdminAccess(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = updateRideSchema.parse(body);

    const rideId = context?.params?.rideId || request.nextUrl.searchParams.get("rideId");
    if (!rideId) {
      return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });
    }

    const ride = await Ride.findByIdAndUpdate(rideId, data, {
      new: true,
    }).populate("driverId", "firstName lastName email");

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Ride updated successfully",
        ride,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update ride error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update ride" },
      { status: 500 },
    );
  }
}

// DELETE - Delete ride
export async function DELETE(
  request: NextRequest,
  context?: { params?: { rideId?: string } },
) {
  try {
    const admin = await checkAdminAccess(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rideId = context?.params?.rideId || request.nextUrl.searchParams.get("rideId");
    if (!rideId) {
      return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });
    }

    const ride = await Ride.findByIdAndDelete(rideId);

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Ride deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete ride error:", error);
    return NextResponse.json(
      { error: "Failed to delete ride" },
      { status: 500 },
    );
  }
}
