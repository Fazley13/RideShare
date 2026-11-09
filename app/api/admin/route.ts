import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Ride } from "@/lib/models/Ride";
import { Booking } from "@/lib/models/Booking";
import { Review } from "@/lib/models/Review";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

// GET - Admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdminAccess(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalUsers = await User.countDocuments();
    const totalRides = await Ride.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    const drivers = await User.countDocuments({ role: "driver" });
    const passengers = await User.countDocuments({ role: "passenger" });

    const activeRides = await Ride.countDocuments({ status: "active" });
    const completedRides = await Ride.countDocuments({ status: "completed" });

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-password");

    const recentRides = await Ride.find().sort({ createdAt: -1 }).limit(10);

    return NextResponse.json(
      {
        stats: {
          totalUsers,
          totalRides,
          totalBookings,
          totalReviews,
          drivers,
          passengers,
          activeRides,
          completedRides,
        },
        recentUsers,
        recentRides,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
