import React from "react";

interface InfoPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  label?: string;
}

export const InfoPageLayout = ({ children, title, subtitle, label }: InfoPageLayoutProps) => {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-20 sm:py-28 relative overflow-hidden">
        {/* Subtle decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="infoPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#infoPattern)" />
          </svg>
        </div>
        
        <div className="container-nuria relative z-10">
          {label && (
            <span className="font-sans text-[11px] font-bold text-secondary uppercase tracking-[0.2em] mb-4 inline-block">
              {label}
            </span>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-lg text-white/80 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="w-[60px] h-[3px] bg-secondary mt-8 rounded-full" />
        </div>
      </div>
      
      <div className="container-nuria py-12 md:py-24">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
