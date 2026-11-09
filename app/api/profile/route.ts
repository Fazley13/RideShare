import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Review } from "@/lib/models/Review";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      phone: z.string(),
      relationship: z.string(),
    })
    .optional(),
  preferences: z
    .object({
      musicPreference: z.string().optional(),
      smokingAllowed: z.boolean().optional(),
      petsAllowed: z.boolean().optional(),
      chatsPreference: z.enum(["quiet", "chatty", "no-preference"]).optional(),
    })
    .optional(),
});

// GET - Get user profile
export async function GET(
  request: NextRequest,
  context?: { params?: { userId?: string } },
) {
  try {
    await connectDB();

    let userId = context?.params?.userId || request.nextUrl.searchParams.get("userId");

    // If no userId provided, get current user
    if (!userId) {
      const authUser = await requireAuth(request);
      if (!authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = authUser.userId;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user reviews
    const reviews = await Review.find({ revieweeId: userId }).populate(
      "reviewerId",
      "firstName lastName profileImage",
    );

    return NextResponse.json(
      {
        user,
        reviews,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    await connectDB();

    const user = await User.findByIdAndUpdate(authUser.userId, data, {
      new: true,
    }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update profile error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
