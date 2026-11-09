import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { comparePasswords, generateToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Compare passwords
    const isPasswordValid = await comparePasswords(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });

    // Return success
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      verifiedEmail: user.verifiedEmail,
      verifiedStudentId: user.verifiedStudentId,
      rating: user.rating,
      rideCount: user.rideCount,
    };

    return NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
        token,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
