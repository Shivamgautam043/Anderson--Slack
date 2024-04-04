import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

// TODO: Shift to using Marquee
export function InfiniteVerticalScroller({animationDurationPerElement, verticalScrollDirection, children}: {animationDurationPerElement?: number, verticalScrollDirection: VerticalScrollDirection, children: React.ReactNode}) {
    animationDurationPerElement = animationDurationPerElement ?? 8;

    let animationDuration;
    if (Array.isArray(children)) {
        animationDuration = animationDurationPerElement * children.length;
    } else {
        // TODO: This kinda hard-codes this to work with ItemBuilder. Change?
        animationDuration = animationDurationPerElement * children.props.items.length;
    }

    return (
        <div className="tw-grid tw-grid-cols-1 tw-overflow-hidden">
            <div
                className={concatenateNonNullStringsWithSpaces(
                    "tw-row-start-1 tw-col-start-1 tw-flex tw-flex-col tw-w-fit",
                    verticalScrollDirection == VerticalScrollDirection.up ? "gjo-infinite-horizontal-scroll-up" : "gjo-infinite-horizontal-scroll-down",
                )}
                style={{animationDuration: `${animationDuration}s`}}
            >
                {children}
            </div>

            <div
                className={concatenateNonNullStringsWithSpaces(
                    "tw-row-start-1 tw-col-start-1 tw-flex tw-flex-col tw-w-fit",
                    verticalScrollDirection == VerticalScrollDirection.up ? "gjo-infinite-horizontal-scroll-up" : "gjo-infinite-horizontal-scroll-down",
                )}
                style={{animationDuration: `${animationDuration}s`, animationDelay: `-${animationDuration / 2}s`}}
            >
                {children}
            </div>
        </div>
    );
}

export enum VerticalScrollDirection {
    up,
    down,
}
