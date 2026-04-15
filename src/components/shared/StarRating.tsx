import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export const StarRating = ({ rating, size = 14 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={star <= Math.round(rating) ? "fill-secondary text-secondary" : "text-border"}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
};
