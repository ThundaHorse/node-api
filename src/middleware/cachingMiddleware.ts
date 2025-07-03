import { Request, Response, NextFunction } from 'express';
import { getCache } from '../util/cache';
import { TransformedCountry } from '../util/types';

const CACHE_KEY_COUNTRIES = 'all-countries';

/**
 * Middleware to serve a list of items from cache if available.
 */
export const cacheAllMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cachedData = getCache(CACHE_KEY_COUNTRIES);
  if (cachedData) {
    res.status(200).json(cachedData);
  } else {
    next();
  }
};

/**
 * Middleware to serve a single country from cache if available.
 * It first checks the 'all-countries' cache, then checks for an individual country cache.
 */
export const cacheSingleMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const countryName = id.toLowerCase();

  // First, check if the full list is cached
  const allCountriesCache = getCache(CACHE_KEY_COUNTRIES) as
    | TransformedCountry[]
    | null;

  if (allCountriesCache) {
    const country = allCountriesCache.find(
      (c) => c.name.toLowerCase() === countryName
    );
    if (country) {
      console.log(`Cache hit for single country '${id}' from full list.`);
      res.status(200).json(country);
      return;
    }
  } else {
    // If not in the full list cache, check for an individual cache entry
    const individualCache = getCache(`country-${countryName}`);
    if (individualCache) {
      res.status(200).json(individualCache);
      return;
    }
  }

  // If no cache hit, proceed to the route handler
  next();
};
