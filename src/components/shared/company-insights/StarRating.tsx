import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className="w-6 h-6 fill-yellow-400 text-yellow-400"
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <StarHalf
              key={index}
              className="w-6 h-6 fill-yellow-400 text-yellow-400"
            />
          );
        }
        return (
          <Star
            key={index}
            className="w-6 h-6 text-gray-300"
          />
        );
      })}
      <span className="ml-2 text-lg font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}
