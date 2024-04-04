import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type {StartAProjectEntryBackendRepresentation} from "~/growth-jockey-common-typescript/typeDefinitions";

export async function upsertStartAProjectEntryPartial(startAProjectEntry: StartAProjectEntryBackendRepresentation): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO start_a_project_entries_partial(
                id,
                created_at,
                updated_at,
                user_analytics,
                data
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            )
            ON CONFLICT(
                id
            )
            DO UPDATE SET
                created_at = EXCLUDED.created_at,
                updated_at = EXCLUDED.updated_at,
                user_analytics = EXCLUDED.user_analytics,
                data = EXCLUDED.data
        `,
        [
            startAProjectEntry.id,
            startAProjectEntry.createdAt,
            startAProjectEntry.updatedAt,
            startAProjectEntry.userAnalytics,
            startAProjectEntry.data,
        ],
    );

    if (result instanceof Error) {
        return result;
    }
}

export async function insertStartAProjectEntry(startAProjectEntry: StartAProjectEntryBackendRepresentation): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    // TODO: Delete entry from autosave entries?
    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO start_a_project_entries(
                id,
                created_at,
                updated_at,
                user_analytics,
                data
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            )
        `,
        [
            startAProjectEntry.id,
            startAProjectEntry.createdAt,
            startAProjectEntry.updatedAt,
            startAProjectEntry.userAnalytics,
            startAProjectEntry.data,
        ],
    );

    if (result instanceof Error) {
        return result;
    }
}
