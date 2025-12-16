import { Music, Trophy, Theater, Mic2, PartyPopper, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "All Events", icon: PartyPopper, active: true },
  { name: "Concerts", icon: Music, active: false },
  { name: "Sports", icon: Trophy, active: false },
  { name: "Theatre", icon: Theater, active: false },
  { name: "Comedy", icon: Mic2, active: false },
  { name: "Gaming", icon: Gamepad2, active: false },
];

const CategoryFilter = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={category.active ? "hero" : "glass"}
              size="lg"
              className={`gap-2 ${!category.active ? "hover:border-primary/50" : ""}`}
            >
              <category.icon className="h-5 w-5" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
