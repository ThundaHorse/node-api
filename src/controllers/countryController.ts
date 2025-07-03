import { NextFunction, Request, Response } from 'express';
import { getProcessedCountries, getProcessedCountryByName } from '../api/api';
import { setCache } from '../util/cache';
import * as api from '@opentelemetry/api';

import { setupTracing } from '../core/opentelemetry/tracer';

const CACHE_KEY_ALL_COUNTRIES = 'all-countries';
const CACHE_TTL_SECONDS = 600; // Cache for 10 minutes

const tracer = setupTracing('node-api-service');

export const getAllCountries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const span = tracer.startSpan('client.makeRequest()', {
    kind: api.SpanKind.CLIENT
  });

  try {
    console.log('Fetching fresh data for ALL countries...');
    const countries = await getProcessedCountries();
    setCache(CACHE_KEY_ALL_COUNTRIES, countries, CACHE_TTL_SECONDS);
    res.status(200).json(countries);
    span.setStatus({ code: api.SpanStatusCode.OK });
  } catch (error) {
    span.setStatus({
      code: api.SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    next(error);
  }

  span.end();
};

export const getCountryByName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`Fetching fresh data for SINGLE country: ${id}...`);
    const country = await getProcessedCountryByName(id);

    if (!country) {
      res.status(404).json({ message: 'Country not found.' });
      return;
    }

    // Cache the individual country result
    setCache(`country-${id.toLowerCase()}`, country, CACHE_TTL_SECONDS);
    res.status(200).json(country);
  } catch (error) {
    next(error);
  }
};
