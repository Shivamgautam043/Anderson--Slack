import {getTtlCache} from "~/growth-jockey-common-typescript/server/cache.server";

export function sanitizeSearchString(searchString: string) {
    // remove trailing spaces
    searchString = searchString.trim();
    // remove special characters
    searchString = searchString.replace(/[^a-zA-Z0-9 ]/g, " ");
    // remove multiple spaces
    searchString = searchString.replace(/\s\s+/g, " ");
    // convert to lowercase
    searchString = searchString.toLowerCase();
    return searchString;
}

// Cached function for caching function calls
export async function Cached<T>(
    // cache key
    cacheKey: string,
    // function to be cached
    func: () => Promise<T>,
    // time to live in milliseconds, default is 1 hour -> 60 * 60 * 1000
    ttl: number = 60 * 60 * 1000,
): Promise<T> {
    // get the cache, if it is found, return the value
    const ttlCache = getTtlCache();
    const cachedValue = ttlCache.get(cacheKey);
    if (cachedValue) {
        return cachedValue;
    }

    // if the value is not found, call the function and cache the value
    const value = await func();
    if (value instanceof Error) {
        throw value;
    }
    ttlCache.set(cacheKey, value, {ttl: ttl});
    return value;
}

export function urlSearchParamsToObject(
    searchParams: URLSearchParams,
): Record<string, unknown> {
    const object: Record<string, unknown> = {};

    for (const [key, value] of searchParams.entries()) {
        // Handle parameter pollution
        if (key in object) {
            throw new Error(`Parameter pollution detected on key: ${key}.`);
        }
        object[key] = value;
    }

    return object;
}
