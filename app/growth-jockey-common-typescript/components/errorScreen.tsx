import {Link} from "@remix-run/react";

export function ErrorScreen({errorText, backLink, backText}: {errorText: string; backLink: string; backText: string}) {
    return (
        <div className="tw-min-h-[calc(100vh-var(--gj-header-height)-var(--gj-mobile-ui-height))] sm:tw-h-[calc(100vh-var(--gj-header-height))] tw-flex tw-flex-col tw-justify-center tw-align-center tw-text-center tw-gap-y-4">
            <div>{errorText}</div>
            <Link to={backLink} className="tw-text-primary">
                {backText}
            </Link>
        </div>
    );
}
