import {Link} from "@remix-run/react";
import {GeoAlt} from "react-bootstrap-icons";
import type {JobListing} from "~/growth-jockey-common-typescript/typeDefinitions";
import {GrowthJockeyAnimatedReadMoreCtaLink} from "~/componentLibrary/growthJockeyAnimatedReadMoreCtaLink";

export function JobListingCard({jobListing}: {jobListing: JobListing}) {
    return (
        <Link
            to={`/careers/${jobListing.role}?id=${jobListing.id}`}
            className="gjo-bg-foreground-100 tw-rounded-lg tw-grid tw-grid-cols-2 tw-p-8 tw-grid-rows-[auto_auto_minmax(0,1fr)_auto] tw-items-start tw-gap-y-2 tw-relative"
        >
            {jobListing.isHotHiring && (
                <div className="tw-absolute tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-right-0 tw-top-0 tw-gap-2 tw-py-[.125rem] tw-items-center tw-w-[7.5rem] gjo-bg-primary-300 tw-rounded-tr-lg tw-rounded-bl-[2rem] tw-pl-4 tw-shadow-[inset_2px_-3px_2px_#00000024]">
                    <div className="tw-h-6 tw-w-6 tw-col-start-1">🔥</div>
                    <div className="gjo-text-icon tw-col-start-2 tw-text-background-500-light">
                        Hot Hiring
                    </div>
                </div>
            )}

            <div className="gjo-text-primary-500 gjo-text-body-bold tw-grid tw-grid-rows-2 tw-gap-y-1 tw-row-start-1 tw-col-span-full">
                <div className="tw-row-start-1">{jobListing.role}</div>
                <div className="tw-row-start-2">{jobListing.band}</div>
            </div>

            <div className="gjo-text-body-bold tw-grid tw-row-start-2 tw-col-span-full">
                {jobListing.department} {">"} {jobListing.function}
            </div>

            <div className="gjo-text-body tw-row-start-3 tw-col-span-full">
                {jobListing.description}
            </div>

            <div className="tw-grid tw-grid-cols-[auto_minmax(0,1fr)_auto_auto] tw-items-center tw-gap-x-2 tw-row-start-4 tw-col-span-full tw-pt-3">
                <GeoAlt className="tw-w-7 tw-h-7 tw-flex-none gjo-text-primary-500" />
                <div className="gjo-text-body tw-line-clamp-1">{`${jobListing.location.city}, ${jobListing.location.country}`}</div>
                <GrowthJockeyAnimatedReadMoreCtaLink />

                {/* <ArrowRightCircle className="tw-w-7 tw-h-7 gjo-text-primary-500" />
                <GrowthJockeyContent contentId="a64fc640-6011-4d77-b33a-3708101da638" /> */}
            </div>
        </Link>
    );
}
