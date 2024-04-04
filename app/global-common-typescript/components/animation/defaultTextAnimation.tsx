import {Fade} from "react-awesome-reveal";

export function DefaultTextAnimation({delay, className, children, damping, cascade}: {delay?: number; className?: string; damping?: number; cascade?: boolean; children}) {
    return (
        <Fade
            direction="up"
            delay={delay}
            className={className}
            fraction={0.5}
            triggerOnce
            damping={damping ?? 0}
            cascade={cascade ?? false}
        >
            {children}
        </Fade>
    );
}

export function DefaultTextAnimationLeft({delay, className, children, damping, cascade}: {delay?: number; className?: string; damping?: number; cascade?: boolean; children}) {
    return (
        <Fade
            direction="left"
            delay={delay}
            className={className}
            fraction={0.5}
            triggerOnce
            damping={damping ?? 0}
            cascade={cascade ?? false}
        >
            {children}
        </Fade>
    );
}

export function DefaultTextAnimationRight({delay, className, children, damping, cascade}: {delay?: number; className?: string; damping?: number; cascade?: boolean; children}) {
    return (
        <Fade
            direction="right"
            delay={delay}
            className={className}
            fraction={0.5}
            triggerOnce
            damping={damping ?? 0}
            cascade={cascade ?? false}
        >
            {children}
        </Fade>
    );
}
