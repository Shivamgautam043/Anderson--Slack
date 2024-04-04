import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

export function HorizontalSpacer({className}: {className?: string}) {
    if (className == null) {
        className = "tw-w-8";
    }

    return (
        <div
            className={concatenateNonNullStringsWithSpaces(
                "tw-flex-none tw-self-stretch",
                className,
            )}
        ></div>
    );
}
