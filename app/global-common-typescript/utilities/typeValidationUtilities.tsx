import {z} from "zod";
import type {
    Integer,
    Iso8601DateTime,
    NonEmptyString,
    Uuid,
} from "~/common--type-definitions/typeDefinitions";
import {
    zodIso8601DateTime,
    zodUuid,
} from "~/global-common-typescript/utilities/validationPatterns";

export function safeParse<T>(
    parse: (input: unknown) => T,
    input: unknown,
): T | null {
    try {
        const output = parse(input);
        return output;
    } catch {
        return null;
    }
}

export function safeParseEnumValueFromUnknown<T>(
    parse: (
        input: unknown,
        enumObject: Record<string | symbol | number, T>,
    ) => T,
    input: unknown,
    enumObject: Record<string | symbol | number, T>,
) {
    try {
        const output = parse(input, enumObject);
        return output;
    } catch {
        return null;
    }
}

// export function safeParseToUndefined<T>(parse: (input: unknown) => T, input: unknown): T | undefined {
//     try {
//         const output = parse(input);
//         return output;
//     } catch {
//         return undefined;
//     }
// }

export function getIso8601DateTimeFromUnknown(input: unknown): Iso8601DateTime {
    zodIso8601DateTime.parse(input);

    return input as Iso8601DateTime;
}

export function getUuidFromUnknown(input: unknown): Uuid {
    zodUuid.parse(input);

    return input as Uuid;
}

export function getEnumValueFromUnknown<T>(
    input: unknown,
    // TODO: Figure out type
    enumObject: Record<string | symbol | number, T>,
): T {
    if (Object.values(enumObject).includes(input as T)) {
        return input as T;
    }

    throw new Error("Invalid value");
}

export function getStringFromUnknown(input: unknown): string {
    // TODO: Replace with zod
    if (typeof input != "string") {
        throw new Error(
            `${input} of type ${typeof input} is not a valid string!`,
        );
    }

    return input;
}

export function getNonEmptyStringFromUnknown(input: unknown): NonEmptyString {
    // TODO: Replace with zod
    if (typeof input != "string" || input.length == 0) {
        throw new Error(
            `${input} of type ${typeof input} is not a valid NonEmptyString!`,
        );
    }

    return input as NonEmptyString;
}

// TODO: Accept a number or string, and parse accordingly
export function getIntegerFromUnknown(input: unknown): Integer {
    // TODO: Replace with zod
    if (typeof input != "string" || input.length == 0) {
        throw new Error(
            `${input} of type ${typeof input} is not a valid Integer!`,
        );
    }

    const int = parseInt(input);

    if (isNaN(int)) {
        throw new Error(
            `${input} of type ${typeof input} is not a valid Integer!`,
        );
    }

    return int;
}

// TODO: Accept a number or string, and parse accordingly
export function getNumberFromUnknown(input: unknown): number {
    // TODO: Replace with zod
    if (typeof input != "string" || input.length == 0) {
        throw new Error(
            `${input} of type ${typeof input} is not a valid number!`,
        );
    }

    const number = parseFloat(input);

    if (isNaN(number)) {
        throw new Error(
            `${input} of type ${typeof input} is not a valid number!`,
        );
    }

    return number;
}

export function getErrorFromUnknown(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    return new Error(String(error));
}

export function getObjectFromUnknown(input: unknown): unknown {
    // TODO: Replace with zod
    if (typeof input != "string" || input.length == 0) {
        throw new Error(
            `${input} of type ${typeof input} is not a valid JSON!`,
        );
    }

    const obj = JSON.parse(input);

    return obj;
}

// TODO: Accept a boolean or string, and parse accordingly
export function getBooleanFromUnknown(input: unknown): boolean {
    const validateBoolean = z.boolean().or(
        z
            .string()
            .toLowerCase()
            .transform((x) => x === "true")
            .pipe(z.boolean()),
    );
    const parsedInput = validateBoolean.parse(input);

    return parsedInput;
}

export function getFileFromUnknown(input: unknown): File {
    if (!(input instanceof File)) {
        throw new Error(
            `${input} of type ${typeof input} is not a valid file!`,
        );
    }

    return input;
}

// TODO: Rework these to accept unknown

// export function getNumberOrNullFromString(str: string | null | undefined): number | null {
//     if (str == null || str.length == 0) {
//         return null;
//     }

//     const int = Number(str);

//     if (isNaN(int)) {
//         return null;
//     }

//     return int;
// }

// export function getObjectOrNullFromString(str: string | null | undefined): any | null {
//     if (str == null || str.length == 0) {
//         return null;
//     }

//     return JSON.parse(str);
// }

// export function getNonEmptyArrayOrNull<T>(arr: Array<T> | null | undefined): Array<T> | null {
//     if (arr == null || arr.length == 0) {
//         return null;
//     }

//     return arr;
// }
