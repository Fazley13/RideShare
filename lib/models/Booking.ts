import mongoose from "mongoose";

export interface IBooking {
  _id?: string;
  rideId: string;
  passengerId: string;
  driverId: string;
  passengerCount: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  seatNumbers: string[];
  notes?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    rideId: {
      type: String,
      required: true,
      ref: "Ride",
    },
    passengerId: {
      type: String,
      required: true,
      ref: "User",
    },
    driverId: {
      type: String,
      required: true,
      ref: "User",
    },
    passengerCount: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    seatNumbers: [String],
    notes: String,
    pickupLocation: String,
    dropoffLocation: String,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  },
);

export const Booking =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
