import {Fade} from "react-awesome-reveal";

export function DefaultImageAnimation({delay, className, children}: {delay?: number; className?: string; children}) {
    return (
        <Fade
            delay={100 + (delay ?? 0)}
            className={className}
            fraction={0}
            triggerOnce
        >
            {children}
        </Fade>
    );
}
