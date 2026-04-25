import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export enum Sector {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
  BOTH = "both",
  UNKNOWN = "unknown",
}

export interface TourismLead {
  name: string;
  country: string;
  city: string;
  sector: Sector;
  email: string;
  phone: string;
  website: string;
  description: string;
}

const tourismLeadSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Company or provider name" },
      country: { type: Type.STRING },
      city: { type: Type.STRING },
      sector: { 
        type: Type.STRING, 
        enum: ["inbound", "outbound", "both", "unknown"],
        description: "Whether they focus on people coming in (inbound) or going out (outbound)" 
      },
      email: { type: Type.STRING, description: "Contact email if available" },
      phone: { type: Type.STRING, description: "Contact phone if available" },
      website: { type: Type.STRING, description: "Official website URL" },
      description: { type: Type.STRING, description: "Brief description of their business" },
    },
    required: ["name", "country", "city", "sector", "website", "description"],
  },
};

export async function searchTourismLeads(country: string, city: string): Promise<TourismLead[]> {
  const prompt = `Search for major tourism providers, travel agencies, tour operators, and hospitality leads in ${city}, ${country}. 
  Provide a list of at least 8 real businesses. 
  For each one, specify if they are an inbound operator (bringing tourists to the region), outbound (sending locals abroad), or both.
  Include their official website, email, phone number, and a professional description of their services.
  
  Use Google Search to ensure the information is accurate and up-to-date.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }] as any,
      config: {
        responseMimeType: "application/json",
        responseSchema: tourismLeadSchema as any,
      },
    } as any);

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as TourismLead[];
  } catch (error) {
    console.error("Error searching tourism leads:", error);
    throw error;
  }
}
