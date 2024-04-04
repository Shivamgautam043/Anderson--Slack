import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

export function UnexpectedValueError(message: string): Error {
    return new Error(concatenateNonNullStringsWithSpaces(`UnexpectedValueError${message == null ? "" : `: ${message}`}`));
}
