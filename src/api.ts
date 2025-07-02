import { RawCountryData, TransformedCountry } from './types';

const API_URL =
  'https://restcountries.com/v3.1/all?fields=name,region,languages,flags,population';

// Transforms a single raw country object into our desired format
const transformCountryData = (country: RawCountryData): TransformedCountry => {
  return {
    name: country.name.common,
    region: country.region,
    population: country.population,
    languages: country.languages ? Object.values(country.languages) : [],
    flagUrl: country.flags.svg,
  };
};

export const getProcessedCountries = async (): Promise<
  TransformedCountry[]
> => {
  try {
    const response = await fetch(API_URL).then((res) => res.json());

    return response.map(transformCountryData);
  } catch (error) {
    console.error(error);
    throw new Error(`${error}`);
  }
};

/**
 * Fetches and transforms data for a single country by its common name.
 * @param name The common name of the country.
 */
export const getProcessedCountryByName = async (
  name: string
): Promise<TransformedCountry | null> => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${name}?fields=name,region,languages,flags,population`
    ).then((res) => res.json());

    const data = response.map(transformCountryData);

    if (data.length === 0) {
      return null;
    }
    // The API returns an array even for a single result
    return data;
  } catch (error: any) {
    // The API returns a 404 if the country is not found, which axios treats as an error
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error(`Failed to fetch country '${name}':`, error.message);
    throw new Error(
      'Could not retrieve data from the external country service.'
    );
  }
};
