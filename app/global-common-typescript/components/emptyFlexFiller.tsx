import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

export function EmptyFlexFiller({className}: {className?: string}) {
    return (
        <div
            className={concatenateNonNullStringsWithSpaces(
                "tw-flex-1",
                className,
            )}
        />
    );
}
