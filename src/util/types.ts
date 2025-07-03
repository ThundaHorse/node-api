export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}
// Defines the shape of the raw data from the external API
export interface RawCountryData {
  name: {
    common: string;
  };
  region: string;
  population: number;
  languages: { [key: string]: string };
  flags: {
    svg: string;
  };
}

// Defines the clean, transformed data structure we want to use
export interface TransformedCountry {
  name: string;
  region: string;
  population: number;
  languages: string[];
  flagUrl: string;
}
