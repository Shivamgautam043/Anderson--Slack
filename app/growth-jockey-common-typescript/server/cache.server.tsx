import TTLCache from "@isaacs/ttlcache";

declare global {
    var _ttlCache: TTLCache<string, any> | null;
}

export function getTtlCache(): TTLCache<string, any> {
    if (global._ttlCache == null) {
        global._ttlCache = new TTLCache({
            // Max number of entries
            max: 1000,
            // Cache time in ms; 1hr = 60 * 60 * 1 * 1000
            ttl: 3600000
        });
    }

    return global._ttlCache;
}
