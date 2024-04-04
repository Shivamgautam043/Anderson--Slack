import Marquee from "react-marquee-slider";

export enum HorizontalScrollDirection {
    "leftToRight" = "ltr",
    "rightToLeft" = "rtl",
}

export function InfiniteHorizontalScroller({speed, horizontalScrollDirection, children}: {speed: number; horizontalScrollDirection: HorizontalScrollDirection; children: React.ReactNode}) {
    return (
        <Marquee
            direction={horizontalScrollDirection}
            velocity={speed}
        >
            {children}
        </Marquee>
    );
}
