import {Link} from "@remix-run/react";
import {ArrowRightCircle, GeoAlt} from "react-bootstrap-icons";
import {VerticalSpacer} from "~/global-common-typescript/components/verticalSpacer";
import type {Uuid} from "~/common--type-definitions/typeDefinitions";

export type JobListing = {
    id: Uuid;
    createdAt: string;
    lastUpdatedAt: string;
    isActive: boolean;
    role: string;
    band: string;
    department: string;
    function: string;
    shortDescription: string;
    description: string;
    jobRolesAndKeyDeliverables: Array<string>;
    qualificationsAndExperience: Array<string>;
    keySkills: Array<string>;
    location: {
        city: string;
        country: string;
    };
    positionClassification: string;
};

export function JobListingCard({jobListing}: {jobListing: JobListing}) {
    return (
        <Link
            to={`/careers/${jobListing.id}`}
            className="tw-bg-bg+1 tw-rounded-lg tw-flex tw-flex-col tw-p-8"
        >
            <div className="tw-text-primary tw-font-body+2">
                {jobListing.role} {">"} {jobListing.band}
            </div>

            <VerticalSpacer className="tw-h-4" />

            <div className="tw-font-bold">
                {jobListing.department} {">"} {jobListing.function}
            </div>

            <VerticalSpacer className="tw-h-4" />

            <div className="tw-text-fg-1 job-listing-card-description">
                {jobListing.description}
            </div>

            <VerticalSpacer className="tw-h-8" />

            <div className="tw-flex-grow" />

            <div className="tw-grid tw-grid-cols-[auto_minmax(0,1fr)_auto_auto] tw-items-center tw-gap-x-2">
                <GeoAlt className="tw-w-6 tw-h-6 tw-flex-none" />
                <div className="tw-line-clamp-1">{`${jobListing.location.city}, ${jobListing.location.country}`}</div>
                <ArrowRightCircle className="tw-w-6 tw-h-6 tw-text-primary" />
                <div className="tw-text-primary">View Job</div>
            </div>
        </Link>
    );
}
