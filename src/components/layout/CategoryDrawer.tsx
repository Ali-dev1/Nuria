import React from "react";
import { 
  X, BookOpen, GraduationCap, Globe, Heart, 
  Briefcase, Baby, Lightbulb, Smartphone, Shirt 
} from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/constants";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Lightbulb, GraduationCap, Baby, Heart, Globe, Briefcase, Smartphone, Shirt,
};

interface CategoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryDrawer = ({ open, onOpenChange }: CategoryDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white flex flex-col rounded-t-[2rem] h-[calc(100%-64px)] mt-24 outline-none">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <DrawerTitle className="font-display text-2xl font-bold text-foreground">
              Browse Categories
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </DrawerClose>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon] || BookOpen;
              return (
                <Link
                  key={cat.id}
                  to={`/books?category=${cat.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex flex-col items-center gap-3 p-4 bg-background rounded-2xl border border-border/50 active:scale-95 transition-all"
                >
                  <div className="p-3 rounded-full bg-primary/5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-sans text-[11px] font-bold text-foreground text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
