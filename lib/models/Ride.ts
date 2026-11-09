import mongoose from "mongoose";
import { GenderPolicy } from "@/lib/safety";

export interface IRide {
  _id?: string;
  driverId: string;
  driverName: string;
  driverGender: "female" | "male" | "other";
  driverRating: number;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  origin: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  destination: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  departureTime: Date;
  estimatedArrivalTime: Date;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  genderPolicy: GenderPolicy;
  amenities: {
    airConditioning: boolean;
    aux: boolean;
    charger: boolean;
    wifi: boolean;
  };
  rules: {
    smokingAllowed: boolean;
    petsAllowed: boolean;
    luggage: boolean;
  };
  status: "active" | "completed" | "cancelled";
  passengers: string[]; // User IDs
  bookings: string[]; // Booking IDs
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rideSchema = new mongoose.Schema<IRide>(
  {
    driverId: {
      type: String,
      required: true,
      ref: "User",
    },
    driverName: String,
    driverGender: {
      type: String,
      enum: ["female", "male", "other"],
    },
    driverRating: Number,
    vehicleInfo: {
      make: String,
      model: String,
      year: Number,
      color: String,
      licensePlate: String,
    },
    origin: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    destination: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    departureTime: {
      type: Date,
      required: true,
    },
    estimatedArrivalTime: Date,
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    genderPolicy: {
      type: String,
      enum: ["any", "women_only", "same_gender_only"],
      default: "any",
    },
    amenities: {
      airConditioning: Boolean,
      aux: Boolean,
      charger: Boolean,
      wifi: Boolean,
    },
    rules: {
      smokingAllowed: Boolean,
      petsAllowed: Boolean,
      luggage: Boolean,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    passengers: [
      {
        type: String,
        ref: "User",
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    notes: String,
  },
  {
    timestamps: true,
  },
);

export const Ride =
  mongoose.models.Ride || mongoose.model<IRide>("Ride", rideSchema);
