import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";


export function InvalidEnumValueError(message: string): Error {
    return new Error(concatenateNonNullStringsWithSpaces(`InvalidEnumValueError${message == null ? "" : `: ${message}`}`));
}
