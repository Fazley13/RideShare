import { z } from "zod";

export const genderPolicySchema = z.enum([
  "any",
  "women_only",
  "same_gender_only",
]);

export const rideSearchSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  date: z.string().optional(),
  time: z.string().optional(),
  filters: z.object({
    priceRange: z.tuple([z.number().min(0), z.number().min(0)]),
    driverRating: z.number().min(0).max(5),
    luggageSpace: z.boolean(),
  }),
  safety: z.object({
    genderPolicy: genderPolicySchema,
  }),
});

export const rideBookingSchema = z.object({
  rideId: z.string().min(1),
  passengerCount: z.number().int().positive(),
  seatNumber: z.string().optional(),
  agreedToTerms: z.literal(true),
});

export type GenderPolicy = z.infer<typeof genderPolicySchema>;

type UserContext = {
  userId: string;
  verifiedEmail: boolean;
  verifiedStudentId: boolean;
  gender: "female" | "male" | "other";
};

type RideContext = {
  driverId: string;
  driverGender: "female" | "male" | "other";
  genderPolicy: GenderPolicy;
};

export function enforceGenderPolicy(user: UserContext, ride: RideContext) {
  if (!user.verifiedEmail || !user.verifiedStudentId) {
    throw new Error("User must be fully verified to book rides");
  }

  if (ride.genderPolicy === "women_only" && user.gender !== "female") {
    throw new Error("This ride is restricted to women passengers only");
  }

  if (
    ride.genderPolicy === "same_gender_only" &&
    user.gender !== ride.driverGender
  ) {
    throw new Error("This ride is restricted to same-gender passengers");
  }
}
