import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please register this email address first." },
        { status: 404 },
      );
    }

    user.role = "admin";
    await user.save();

    return NextResponse.json(
      {
        message: `User ${email} successfully promoted to Admin! You can now log into the Admin Portal.`,
        user: {
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to promote user to admin" },
      { status: 500 },
    );
  }
}
