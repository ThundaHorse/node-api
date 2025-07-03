const cache = new Map<string, { data: any; expires: number }>();

/**
 * Sets a value in the cache with a Time-To-Live (TTL).
 * @param key The cache key.
 * @param value The data to cache.
 * @param ttlSeconds The time in seconds for which the cache is valid.
 */
export const setCache = (key: string, value: any, ttlSeconds: number): void => {
  const expires = Date.now() + ttlSeconds * 1000;
  cache.set(key, { data: value, expires });
  console.log(`Cache set for key: ${key}`);
};

/**
 * Gets a value from the cache. Returns null if the key is not found or the cache has expired.
 * @param key The cache key.
 * @returns The cached data or null.
 */
export const getCache = (key: string): any | null => {
  const entry = cache.get(key);

  if (entry && Date.now() < entry.expires) {
    console.log(`Cache hit for key: ${key}`);
    return entry.data;
  }

  if (entry) {
    console.log(`Cache expired for key: ${key}`);
    cache.delete(key); // Clean up expired cache
  } else {
    console.log(`Cache miss for key: ${key}`);
  }

  return null;
};
