"use client";

import { create } from "zustand";

export type GenderPolicy = "any" | "women_only" | "same_gender_only";

type RideFiltersState = {
  origin: string;
  destination: string;
  date: string;
  time: string;
  priceMin: number;
  priceMax: number;
  driverRating: number;
  luggageSpace: boolean;
  genderPolicy: GenderPolicy;
  setField: <K extends keyof Omit<RideFiltersState, "setField" | "reset">>(
    key: K,
    value: RideFiltersState[K],
  ) => void;
  reset: () => void;
};

const initialState = {
  origin: "",
  destination: "",
  date: "",
  time: "",
  priceMin: 0,
  priceMax: 100,
  driverRating: 4,
  luggageSpace: false,
  genderPolicy: "any" as GenderPolicy,
};

export const useRideFiltersStore = create<RideFiltersState>((set) => ({
  ...initialState,
  setField: (key, value) => set((state) => ({ ...state, [key]: value })),
  reset: () => set(initialState),
}));
