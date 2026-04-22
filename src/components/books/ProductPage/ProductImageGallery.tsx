import React from "react";

interface ProductImageGalleryProps {
  product: {
    images?: string[];
    title: string;
    price: number;
    originalPrice?: number;
  };
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product }) => {
  return (
    <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden max-w-md mx-auto lg:max-w-none w-full shadow-2xl">
      {product.images?.[0] && product.images[0] !== "/placeholder.svg" && !product.images[0].includes("placeholder") ? (
        <img 
          src={product.images[0].includes("unsplash.com") ? `${product.images[0]}&fm=webp&q=80` : product.images[0]} 
          alt={product.title} 
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.nextElementSibling) (target.nextElementSibling as HTMLElement).style.display = "flex";
          }}
        />
      ) : null}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-muted to-muted/50 text-center" style={{ display: product.images?.[0] && product.images[0] !== "/placeholder.svg" && !product.images[0].includes("placeholder") ? "none" : "flex" }}>
        <div className="flex flex-col items-center">
          <span className="font-display text-sm font-bold text-secondary mb-4 uppercase tracking-[0.2em] opacity-60">Nuria Store</span>
          <h2 className="font-display text-3xl text-foreground/40 font-bold leading-tight">{product.title}</h2>
          <div className="h-1 w-12 bg-secondary/30 my-6 rounded-full" />
          <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Original Cover Coming Soon</p>
        </div>
      </div>
      {product.originalPrice && product.originalPrice > product.price && (
        <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1.5 rounded-lg shadow-lg">SALE</span>
      )}
    </div>
  );
};
