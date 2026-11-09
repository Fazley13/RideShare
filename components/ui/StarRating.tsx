"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

export const StarRating: React.FC<{
  value?: number;
  onChange?: (v: number) => void;
  size?: number;
}> = ({ value = 0, onChange, size = 20 }) => {
  const [hover, setHover] = useState(0);
  const current = value;
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className={`p-1 rounded-full ${(hover || current) >= n ? "text-amber-400 transform scale-110" : "text-[#E8E8E8]"} transition-transform duration-150`}
        >
          <Star size={size} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
