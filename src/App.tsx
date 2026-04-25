import { useState } from "react";
import { searchTourismLeads, TourismLead } from "./services/geminiService";
import { FilterBar } from "./components/FilterBar";
import { LeadCard } from "./components/LeadCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Compass, SearchX, Info, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [leads, setLeads] = useState<TourismLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (country: string, city: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const results = await searchTourismLeads(country, city);
      setLeads(results);
    } catch (err) {
      setError("Failed to fetch leads. Please try again with different keywords or check your connection.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/10">
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-1.5 rounded-lg">
              <Compass className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              TourLeads Finder
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Powered by Gemini & Google Search
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <section className="mb-10 text-center space-y-4">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Scale Your Tourism Network
            </h2>
            <p className="text-muted-foreground text-lg">
              Find verified tourism providers, operators, and agents in any city around the world.
            </p>
          </div>
          <div className="mt-8">
            <FilterBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </section>

        <Separator className="my-10" />

        <div className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {!hasSearched && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 border-2 border-dashed rounded-2xl bg-card/30">
              <div className="bg-muted p-6 rounded-full">
                <Compass className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Ready to explore?</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Enter a country and city above to start searching for tourism industry leads.
                </p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                      <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-muted/20 space-y-2 border-t">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <div key="results">
                {hasSearched && leads.length === 0 && !error ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <SearchX className="w-12 h-12 text-muted-foreground/30" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">No results found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or verify the city name.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {leads.map((lead, index) => (
                      <LeadCard key={`${lead.name}-${index}`} lead={lead} index={index} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t py-8 mt-20 bg-card/30">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary font-bold">
            <Compass className="w-5 h-5" />
            TourLeads Finder
          </div>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Professional lead generation tool for the global tourism sector. Real-time insights powered by AI.
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground pt-4">
            <span>© 2026 TourLeads Finder</span>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

