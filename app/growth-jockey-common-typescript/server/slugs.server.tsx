import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import {Slug} from "~/growth-jockey-common-typescript/typeDefinitions";
import {
    generateUuid,
    getCurrentIsoTimestamp,
    getSingletonValue,
} from "~/global-common-typescript/utilities/utilities";
import {Uuid} from "~/common--type-definitions/typeDefinitions";

// Enumerate functions

function rowToSlug(row: unknown): Slug {
    // TODO: Validation of row using zod
    const slug: Slug = {
        id: row["id"],
        slug: row["slug"],
        status: row["status"],
        created_at: row["created_at"],
        updated_at: row["updated_at"],
        blog_id: row["blog_id"],
    };

    return slug;
}

const tableName = "blog_slugs";

// Slugs table utilities

export async function findSlug(
    partialSlug: Partial<Slug>,
): Promise<Slug | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                ${tableName}
            WHERE
                ${Object.keys(partialSlug)
                    .map((key, index) => {
                        return `${key} = $${index + 1}`;
                    })
                    .join(" AND ")}
        `,
        Object.values(partialSlug),
    );

    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    const row = getSingletonValue(result.rows);

    return rowToSlug(row);
}

export async function createSlug(
    slug: Omit<Slug, "id" | "status" | "created_at" | "updated_at">,
): Promise<Slug | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const currentTimestamp = getCurrentIsoTimestamp();

    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO ${tableName}(
                id,
                slug,
                status,
                created_at,
                updated_at,
                blog_id
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING *
        `,
        [
            generateUuid(),
            slug.slug,
            "ACTIVE",
            currentTimestamp,
            currentTimestamp,
            slug.blog_id,
        ],
    );

    if (result instanceof Error) {
        return result;
    }

    return rowToSlug(getSingletonValue(result.rows));
}

export async function updateSlug(
    partialSlugQuery: Partial<Slug>,
    partialSlug: Partial<Slug>,
): Promise<Slug | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const currentTimestamp = getCurrentIsoTimestamp();

    const result = await postgresDatabaseManager.execute(
        `
            UPDATE
                ${tableName}
            SET
                ${Object.keys(partialSlug)
                    .map((key, index) => {
                        return `${key} = $${
                            Object.keys(partialSlugQuery).length + index + 1
                        }`;
                    })
                    .join(", ")},
                updated_at = $${
                    Object.keys(partialSlugQuery).length +
                    Object.keys(partialSlug).length +
                    1
                }
            WHERE
                ${Object.keys(partialSlugQuery)
                    .map((key, index) => {
                        return `${key} = $${index + 1}`;
                    })
                    .join(" AND ")}
            RETURNING *
        `,
        [
            ...Object.values(partialSlugQuery),
            ...Object.values(partialSlug),
            currentTimestamp,
        ],
    );

    if (result instanceof Error) {
        return result;
    }

    return rowToSlug(result);
}
