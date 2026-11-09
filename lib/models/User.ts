import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: "female" | "male" | "other";
  profileImage?: string;
  verifiedEmail: boolean;
  verifiedStudentId: boolean;
  studentId?: string;
  universityEmail?: string;
  role: "driver" | "passenger" | "admin";
  rating: number;
  rideCount: number;
  verificationDocuments: {
    studentIdUrl?: string;
    licenseUrl?: string;
    verifiedAt?: Date;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    musicPreference?: string;
    smokingAllowed: boolean;
    petsAllowed: boolean;
    chatsPreference: "quiet" | "chatty" | "no-preference";
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["female", "male", "other"],
      required: true,
    },
    profileImage: String,
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
    verifiedStudentId: {
      type: Boolean,
      default: false,
    },
    studentId: String,
    universityEmail: String,
    role: {
      type: String,
      enum: ["driver", "passenger", "admin"],
      default: "passenger",
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    rideCount: {
      type: Number,
      default: 0,
    },
    verificationDocuments: {
      studentIdUrl: String,
      licenseUrl: String,
      verifiedAt: Date,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    preferences: {
      musicPreference: String,
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      chatsPreference: {
        type: String,
        enum: ["quiet", "chatty", "no-preference"],
        default: "no-preference",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
