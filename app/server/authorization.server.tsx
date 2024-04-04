import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";

export async function doesUserHavePermission(
    userId: string,
    project: string,
    destinationBranch: string,
    sourceBranch: string,
): Promise<boolean | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                COUNT(*)
            FROM
                deployment_permissions
            WHERE
                user_id = $1 AND
                project = $2 AND
                destination_branch = $3
        `,
        [userId, project, destinationBranch],
    );
    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return false;
    }

    return true;
}
