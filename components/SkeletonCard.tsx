"use client";

interface SkeletonCardProps {
  type?: "dashboard" | "ride" | "profile" | "status";
}

export default function SkeletonCard({ type = "ride" }: SkeletonCardProps) {
  if (type === "dashboard") {
    return (
      <div className="animate-pulse space-y-4">
        {/* Quick Actions grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
          <div className="h-28 bg-gray-200 rounded-2xl" />
        </div>
        {/* Pro Tip */}
        <div className="h-14 bg-gray-200 rounded-2xl" />
        {/* Upcoming Section Header */}
        <div className="h-6 w-1/3 bg-gray-200 rounded-md" />
        {/* Active ride */}
        <div className="h-44 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (type === "profile") {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-28 bg-gray-200 rounded-2xl" />
        <div className="h-8 w-1/2 bg-gray-200 rounded-md mx-auto" />
        <div className="h-4 w-1/3 bg-gray-200 rounded-md mx-auto" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-gray-200 rounded-2xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (type === "status") {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  // default: ride search card skeleton
  return (
    <div className="animate-pulse border border-gray-100 rounded-2xl p-4 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gray-200 rounded-md" />
            <div className="h-3 w-16 bg-gray-200 rounded-md" />
          </div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded-md" />
      </div>

      <div className="space-y-2 pt-2">
        <div className="h-3 w-3/4 bg-gray-200 rounded-md" />
        <div className="h-3 w-1/2 bg-gray-200 rounded-md" />
      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="h-4 w-12 bg-gray-200 rounded-md" />
        <div className="h-9 w-20 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
