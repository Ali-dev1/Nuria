import React from "react";
import { BookCard } from "@/components/books/BookCard";

interface RelatedProductsProps {
  related: Record<string, unknown>[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ related }) => {
  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-bold text-foreground mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {related.map((p: any) => (
          <BookCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
