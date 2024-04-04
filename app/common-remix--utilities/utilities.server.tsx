export function getOptionalEnvironmentVariable(variable: string): string | null {
    const value = process.env[variable];

    // Handle undefined case as well
    if (value == null) {
        return null;
    }

    return value;
}

// @deprecated
// Use process.env instead, due to vite shenanigans
export function getRequiredEnvironmentVariable(variable: string): string {
    const value = process.env[variable];

    if (value == null) {
        throw new Error(`Required environment variable ${variable} not found!`);
    }

    return value;
}
