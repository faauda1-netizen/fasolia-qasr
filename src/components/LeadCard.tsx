import { TourismLead, Sector } from "../services/geminiService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, Phone, ExternalLink, MapPin, Building2 } from "lucide-react";
import { motion } from "motion/react";

interface LeadCardProps {
  lead: TourismLead;
  index: number;
}

export function LeadCard({ lead, index }: LeadCardProps) {
  const sectorColor = {
    [Sector.INBOUND]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200",
    [Sector.OUTBOUND]: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
    [Sector.BOTH]: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200",
    [Sector.UNKNOWN]: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200",
  }[lead.sector as Sector] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-muted-foreground/10">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold tracking-tight text-primary">
                {lead.name}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                <span>{lead.city}, {lead.country}</span>
              </div>
            </div>
            <Badge variant="outline" className={`${sectorColor} capitalize border shadow-sm`}>
              {lead.sector}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          <CardDescription className="text-sm leading-relaxed text-foreground/80 line-clamp-4">
            {lead.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="pt-0 flex flex-col gap-2 border-t mt-auto px-6 py-4 bg-muted/30">
          {lead.website && (
            <a
              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline group"
            >
              <Globe className="w-3 h-3 text-muted-foreground" />
              <span className="truncate flex-1">{lead.website.replace(/^https?:\/\//, '')}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          {lead.email && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{lead.phone}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
