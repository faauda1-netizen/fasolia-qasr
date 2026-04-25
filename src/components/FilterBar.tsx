import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Globe2 } from "lucide-react";

interface FilterBarProps {
  onSearch: (country: string, city: string) => void;
  isLoading: boolean;
}

export function FilterBar({ onSearch, isLoading }: FilterBarProps) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (country && city) {
      onSearch(country, city);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end bg-card p-6 rounded-xl border shadow-sm">
      <div className="grid w-full items-center gap-1.5 flex-1">
        <label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-1">
          Country
        </label>
        <div className="relative">
          <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="country"
            placeholder="e.g. Italy"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5 flex-1">
        <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-1">
          City
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="city"
            placeholder="e.g. Rome"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !country || !city} 
        className="w-full md:w-auto px-8 font-semibold shadow-md active:scale-95 transition-transform"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Searching...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Find Leads
          </span>
        )}
      </Button>
    </form>
  );
}
