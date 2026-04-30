import React from "react";
import { formatPrice } from "@/lib/constants";

interface PriceDisplayProps {
  price: number;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, className = "text-sm font-bold text-foreground" }) => {
  return <p className={className}>{formatPrice(price)}</p>;
};
