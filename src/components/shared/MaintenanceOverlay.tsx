import { Book } from "lucide-react";

export const MaintenanceOverlay = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center text-primary-foreground p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-primary-foreground/10 flex items-center justify-center mb-8 animate-bounce">
        <Book className="w-10 h-10" />
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 max-w-md uppercase tracking-tight">
        Maintenance Break
      </h1>
      <p className="text-xl md:text-2xl font-light opacity-90 max-w-lg leading-relaxed italic">
        "maintenance break, we know you want to read books, check back with us soon"
      </p>
      <div className="mt-12 flex gap-4 opacity-50 text-sm font-medium uppercase tracking-widest">
        <span>Nuria</span>
        <span>•</span>
        <span>Nairobi</span>
      </div>
    </div>
  );
};
