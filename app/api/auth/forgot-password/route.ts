import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = forgotPasswordSchema.parse(body);

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: data.email });
    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link will be sent",
        },
        { status: 200 },
      );
    }

    // TODO: Send reset token via email
    // For now, just return success message
    // You would typically:
    // 1. Generate a reset token
    // 2. Save it with expiration time
    // 3. Send email with reset link

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, a password reset link will be sent",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
