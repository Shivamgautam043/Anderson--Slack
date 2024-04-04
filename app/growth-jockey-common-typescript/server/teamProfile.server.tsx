import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type {TeamMember} from "~/growth-jockey-common-typescript/typeDefinitions";

export async function getAllTeamMembers(): Promise<Array<TeamMember> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                team
            ORDER BY
                "order"
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToTeamMemberInformation(row));
}

function rowToTeamMemberInformation(row: unknown): TeamMember {
    const teamMember: TeamMember = {
        id: row.id,
        imageId: row.image_id,
        name: row.name,
        designation: row.designation,
        linkedinUrl: row.linkedin_url,
        bio: row.bio,
    };

    return teamMember;
}
