import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { hashPassword, generateToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string(),
  gender: z.enum(["female", "male", "other"]),
  studentId: z.string().optional(),
  universityEmail: z.string().optional(),
  role: z.enum(["driver", "passenger"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create new user
    const user = new User({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      gender: data.gender,
      studentId: data.studentId,
      universityEmail: data.universityEmail,
      role: data.role || "passenger",
      verifiedEmail: true,
      verifiedStudentId: true,
    });

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      role: user.role,
    });

    // Return success without password
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
    };

    return NextResponse.json(
      {
        message: "Registration successful",
        user: userResponse,
        token,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
