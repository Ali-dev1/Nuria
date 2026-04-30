import React from "react";
import { CheckCircle2, Clock } from "lucide-react";

interface BookStatusBadgeProps {
  isActive: boolean;
  onClick?: () => void;
  variant?: "mobile" | "desktop";
}

export const BookStatusBadge: React.FC<BookStatusBadgeProps> = ({ isActive, onClick, variant = "desktop" }) => {
  if (variant === "mobile") {
    return (
      <button 
        onClick={onClick}
        className={`p-1.5 rounded-lg transition-colors ${isActive ? "text-green-600" : "text-muted-foreground"}`}
      >
        {isActive ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button 
      onClick={onClick} 
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        isActive 
        ? "bg-green-50 text-green-700 border border-green-200" 
        : "bg-gray-50 text-gray-500 border border-gray-200"
      }`}
    >
      {isActive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {isActive ? "Live" : "Draft"}
    </button>
  );
};
