import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type {Uuid} from "~/common--type-definitions/typeDefinitions";
import {generateUuid, getCurrentIsoTimestamp, getSingletonValue} from "~/global-common-typescript/utilities/utilities";
import type {JobApplication, JobListing} from "~/growth-jockey-common-typescript/typeDefinitions";

export async function getJobListings(): Promise<Array<JobListing> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                job_listings
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToJobListing(row));
}

export async function getActiveJobListings(): Promise<Array<JobListing> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                job_listings
            WHERE
                is_active = TRUE
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToJobListing(row));
}

export async function getJobListing(jobListingId: Uuid): Promise<JobListing | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                job_listings
            WHERE
                id = $1
        `,
        [jobListingId],
    );

    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    return rowToJobListing(getSingletonValue(result.rows, "450c9d0b-7b75-45a7-8602-33396626247e"));
}

export async function createJobListing(jobListing: JobListing): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const currentTime = getCurrentIsoTimestamp();

    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO
                job_listings(
                    id,
                    created_at,
                    last_updated_at,
                    is_active,
                    role,
                    band,
                    department,
                    function,
                    short_description,
                    description,
                    job_roles_and_key_deliverables,
                    qualifications_and_experience,
                    key_skills,
                    location,
                    position_classification
                )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                $13,
                $14,
                $15
            )
        `,
        [
            generateUuid(),
            currentTime,
            currentTime,
            jobListing.isActive,
            jobListing.role,
            jobListing.band,
            jobListing.department,
            jobListing.function,
            jobListing.shortDescription,
            jobListing.description,
            JSON.stringify(jobListing.jobRolesAndKeyDeliverables),
            JSON.stringify(jobListing.qualificationsAndExperience),
            JSON.stringify(jobListing.keySkills),
            JSON.stringify(jobListing.location),
            jobListing.positionClassification,
        ],
    );

    if (result instanceof Error) {
        return result;
    }
}

export async function updateJobListing(jobListing: JobListing): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const currentTime = getCurrentIsoTimestamp();

    const result = await postgresDatabaseManager.execute(
        `
            UPDATE
                job_listings
            SET
                last_updated_at = $1,
                is_active = $2,
                role = $3,
                band = $4,
                department = $5,
                function = $6,
                short_description = $7,
                description = $8,
                job_roles_and_key_deliverables = $9,
                qualifications_and_experience = $10,
                key_skills = $11,
                location = $12,
                position_classification = $13
            WHERE
                id = $14
        `,
        [
            currentTime,
            jobListing.isActive,
            jobListing.role,
            jobListing.band,
            jobListing.department,
            jobListing.function,
            jobListing.shortDescription,
            jobListing.description,
            JSON.stringify(jobListing.jobRolesAndKeyDeliverables),
            JSON.stringify(jobListing.qualificationsAndExperience),
            JSON.stringify(jobListing.keySkills),
            JSON.stringify(jobListing.location),
            jobListing.positionClassification,
            jobListing.id,
        ],
    );

    if (result instanceof Error) {
        return result;
    }
}

export async function addJobApplication(id: string, userId: Uuid | null, jobListingId: Uuid, jobApplication: any, resume: File): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const resumeHex = "\\x" + Buffer.from(await resume.arrayBuffer()).toString("hex");

    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO job_applications(
                id,
                timestamp,
                user_id,
                job_listing_id,
                response,
                resume
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
        `,
        [id, getCurrentIsoTimestamp(), userId, jobListingId, JSON.stringify(jobApplication), resumeHex],
    );

    if (result instanceof Error) {
        return result;
    }

    // \copy (SELECT encode(resume, 'hex') FROM job_applications where id = 'e73c417b-0d4a-4a72-869c-28a69490493c') TO 'C:\\Users\\vampcat\\Downloads\\test2.hex';
    // certutil -decodehex test2.hex test2.pdf
}

export async function getJobApplications(): Promise<Array<JobApplication> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                job_applications.timestamp,
                job_applications.job_listing_id,
                job_applications.response,
                job_listings.role,
                job_listings.band
            FROM
                job_applications
            INNER JOIN
                job_listings ON
                    job_listings.id = job_applications.job_listing_id
            ORDER BY
                job_applications.timestamp
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToJobApplication(row));
}

// export async function getResumeForJobApplication2(jobApplicationId: Uuid): Promise<any | null> {
//     const result = await execute(
//         `
//             SELECT
//                 encode(resume, 'escape') AS resume
//             FROM
//                 job_applications
//             WHERE
//                 id = $1
//         `,
//         [jobApplicationId],
//     );

//     const row = getSingletonValue(result.rows);

//     const fs = require("fs");
//     await fs.writeFileSync("C:\\Users\\vampcat\\Downloads\\testtest.pdf", row.resume);
// }

export async function getResumeForJobApplication(jobApplicationId: Uuid): Promise<any | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                resume
            FROM
                job_applications
            WHERE
                id = $1
        `,
        [jobApplicationId],
    );

    if (result instanceof Error) {
        return result;
    }

    return getSingletonValue(result.rows).resume;
}

function rowToJobListing(row: unknown): JobListing {
    const jobListing: JobListing = {
        id: row["id"],
        createdAt: row["created_at"],
        lastUpdatedAt: row["last_updated_at"],
        isActive: row["is_active"],
        role: row["role"],
        band: row["band"],
        department: row["department"],
        function: row["function"],
        shortDescription: row["shortDescription"],
        description: row["description"],
        jobRolesAndKeyDeliverables: row["job_roles_and_key_deliverables"],
        qualificationsAndExperience: row["qualifications_and_experience"],
        keySkills: row["key_skills"],
        location: row["location"],
        positionClassification: row["position_classification"],
        isDeleted: row["is_deleted"],
        isHotHiring: row["is_hot_hiring"],
    };

    return jobListing;
}

function rowToJobApplication(row: unknown): JobApplication {
    const jobApplication: JobApplication = {
        createdAt: row.timestamp,
        jobListingId: row.job_listing_id,
        name: row.response.name,
        emailId: row.response.emailId ? row.response.emailId : row.response.email ? row.response.email : "",
        phoneNumberPrefix: row.response.phoneNumberPrefix,
        phoneNumber: row.response.phoneNumber,
        highestEducation: row.response.highestEducation,
        previousExperience: row.response.previousExperience,
        previousEmployer: row.response.previousEmployer,
        previousDesignation: row.response.previousDesignation,
        currentCtc: row.response.currentCtc,
        noticePeriod: row.response.noticePeriod,
        topSkills: row.response.topSkills,
        portfolioWebsiteUrl: row.response.portfolioWebsiteUrl,
        jobRole: row.role,
        jobBand: row.band,
    };

    return jobApplication;
}

export async function getFilteredJobListings(query: string): Promise<Array<JobListing> | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(query);

    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    return result.rows.map((row) => rowToJobListing(row));
}

export async function getAllJobsApplied(): Promise<Error | number> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                COUNT(*)
            FROM
                job_applications
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    return getSingletonValue(result.rows).count;
}

export async function getAllJobsAppliedForIds(query: string): Promise<Error | number> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(query);

    if (result instanceof Error) {
        return result;
    }

    return getSingletonValue(result.rows).count;
}
