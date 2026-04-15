import { formatPrice } from "@/lib/constants";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
}

export const PriceTag = ({ price, originalPrice, size = "md" }: PriceTagProps) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`font-sans font-bold text-[#1B4332] ${sizeClasses[size]}`}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={`font-sans text-[#6B7280] line-through ${size === "lg" ? "text-sm" : "text-xs"}`}>
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
};
