import {Fade} from "react-awesome-reveal";

export function DefaultElementAnimation({delay, className, children, damping, cascade}: {delay?: number; className?: string; damping?: number; cascade?: boolean; children}) {
    return (
        <Fade
            delay={500 + (delay ?? 0)}
            className={className}
            fraction={0}
            triggerOnce
            damping={damping ?? 0}
            cascading={true}
        >
            {children}
        </Fade>
    );
}
