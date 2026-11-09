"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  interactive?: boolean;
}

export default function StarRating({
  rating,
  onChange,
  interactive = true,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const handleClick = (index: number) => {
    if (interactive) {
      onChange(index);
    }
  };

  return (
    <div className="flex items-center gap-1.5 justify-center">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = hoverRating !== null ? index <= hoverRating : index <= rating;

        return (
          <motion.button
            key={index}
            type="button"
            whileHover={interactive ? { scale: 1.15 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`${
              interactive ? "cursor-pointer p-1" : "cursor-default"
            } focus:outline-none`}
            disabled={!interactive}
          >
            <Star
              size={36}
              className={`transition-colors duration-150 ${
                isFilled
                  ? "fill-brand text-brand"
                  : "text-gray-300 fill-transparent"
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
