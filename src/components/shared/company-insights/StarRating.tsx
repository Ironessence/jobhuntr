import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

export const StarRating = ({ rating }: StarRatingProps) => {
  const getStarFill = (starPosition: number) => {
    const difference = rating - starPosition + 1;

    if (difference >= 1) return "100%"; // Full star
    if (difference > 0) return `${difference * 100}%`; // Partial star
    return "0%"; // Empty star
  };

  return (
    <div className="flex flex-col items-center sm:items-start">
      <p className="text-sm text-muted-foreground mb-1">Company Rating</p>
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((starPosition) => (
            <div
              key={starPosition}
              className="relative"
            >
              {/* White border star (always visible) */}
              <Star
                className="w-6 h-6 text-white"
                fill="none"
                strokeWidth={0}
              />

              {/* Background star */}
              <Star
                className="absolute inset-0 w-6 h-6 text-gray-200 dark:text-gray-700"
                fill="currentColor"
                strokeWidth={0}
              />

              {/* Filled overlay star with clip-path */}
              <div
                className="absolute inset-0 text-yellow-400"
                style={{
                  clipPath: `inset(0 ${100 - parseFloat(getStarFill(starPosition))}% 0 0)`,
                }}
              >
                <Star
                  className="w-6 h-6"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
            </div>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{rating.toFixed(1)} / 5</span>
      </div>
    </div>
  );
};
