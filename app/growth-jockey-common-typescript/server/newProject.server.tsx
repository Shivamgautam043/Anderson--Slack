import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type {Uuid} from "~/common--type-definitions/typeDefinitions";
import {getCurrentIsoTimestamp, getSingletonValue} from "~/global-common-typescript/utilities/utilities";
import type {PartialStartAProjectData} from "~/typeDefinitions";

export async function insertNewProjectLead(startAProjectData: PartialStartAProjectData): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO new_project_leads(
                id,
                created_at,
                updated_at,
                user_analytics,
                partial,
                autosave,
                data
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            )
            ON CONFLICT(
                id
            )
            DO UPDATE SET
                updated_at = EXCLUDED.updated_at,
                partial = EXCLUDED.partial,
                autosave = EXCLUDED.autosave,
                data = EXCLUDED.data
        `,
        [
            startAProjectData.id,
            getCurrentIsoTimestamp(),
            getCurrentIsoTimestamp(),
            startAProjectData.userAnalytics,
            startAProjectData.partial,
            startAProjectData.autosave,
            {
                ...startAProjectData,
                id: undefined,
                userAnalytics: undefined,
                partial: undefined,
            },
        ],
    );

    if (result instanceof Error) {
        return result;
    }
}

export async function getNewProjectLead(id: Uuid): Promise<PartialStartAProjectData | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                id,
                created_at,
                updated_at,
                user_analytics,
                partial,
                autosave,
                data
            FROM
                new_project_leads
            WHERE
                id = $1
        `,
        [id],
    );

    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    return rowToNewProjectLead(getSingletonValue(result.rows));
}

export async function getNewProjectLeads(): Promise<Array<PartialStartAProjectData> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                id,
                created_at,
                updated_at,
                user_analytics,
                partial,
                autosave,
                data
            FROM
                new_project_leads
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map(row => rowToNewProjectLead(row));
}

function rowToNewProjectLead(row: unknown) {
    const newProjectLead: PartialStartAProjectData = {
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        userAnalytics: row.user_analytics,
        partial: row.partial,
        autosave: row.autosave,
        step: row.data.step,
        name: row.data.name,
        email: row.data.email,
        phoneNumber: row.data.phoneNumber,
        companyName: row.data.companyName,
        companyWebsite: row.data.companyWebsite,
        companySize: row.data.companySize,
        services: row.data.services,
        meetingDate: row.data.meetingDate,
        meetingTime: row.data.meetingTime,
    };

    return newProjectLead;
}
