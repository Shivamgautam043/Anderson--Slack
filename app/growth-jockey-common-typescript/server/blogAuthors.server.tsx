import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type {Uuid} from "~/common--type-definitions/typeDefinitions";
import {
    getCurrentIsoTimestamp,
    getSingletonValue,
} from "~/global-common-typescript/utilities/utilities";
import type {BlogAuthor, ImageDetails} from "~/growth-jockey-common-typescript/typeDefinitions";

export async function getBlogAuthors(): Promise<Array<BlogAuthor> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                blog_authors
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToBlogAuthor(row));
}

export async function getBlogAuthor(
    blogAuthorId: Uuid,
): Promise<BlogAuthor | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                *
            FROM
                blog_authors
            WHERE
                id = $1
        `,
        [blogAuthorId],
    );

    if (result instanceof Error) {
        return result;
    }

    const row = getSingletonValue(result.rows);

    return rowToBlogAuthor(row);
}

function rowToBlogAuthor(row: unknown): BlogAuthor {
    const blogAuthor: BlogAuthor = {
        id: row.id,
        createdAt: row.created_at,
        lastUpdatedAt: row.last_updated_at,
        name: row.name,
        image: row.image,
        designation: row.designation,
        bio: row.bio,
        twitterLink: row.twitter_link,
        linkedInLink: row.linkedin_link,
    };

    return blogAuthor;
}

export async function insertBlogAuthor(
    id: Uuid,
    name: string,
    image: ImageDetails,
    designation: string,
    bio: string,
    twitterLink: string,
    linkedInLink: string,
): Promise<void | Error> {
    //
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const currentTimestamp = getCurrentIsoTimestamp();

    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO
                blog_authors(
                    id,
                    created_at,
                    last_updated_at,
                    name,
                    image,
                    designation,
                    bio,
                    twitter_link,
                    linkedin_link
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
                $9
            )
        `,
        [
            id,
            currentTimestamp,
            currentTimestamp,
            name,
            image,
            designation,
            bio,
            twitterLink,
            linkedInLink,
        ],
    );

    if (result instanceof Error) {
        return result;
    }
}

export async function updateBlogAuthor(
    id: Uuid,
    name: string,
    image: ImageDetails,
    designation: string,
    bio: string,
    twitterLink: string,
    linkedInLink: string,
): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const currentTimestamp = getCurrentIsoTimestamp();

    const result = await postgresDatabaseManager.execute(
        `
            UPDATE
                blog_authors
            SET
                last_updated_at = $2,
                name = $3,
                image = $4,
                designation = $5,
                bio = $6,
                twitter_link = $7,
                linkedin_link = $8
            WHERE
                id = $1
        `,
        [
            id,
            currentTimestamp,
            name,
            image,
            designation,
            bio,
            twitterLink,
            linkedInLink,
        ],
    );

    if (result instanceof Error) {
        return result;
    }
}

export async function deleteBlogAuthor(id: Uuid): Promise<void | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            DELETE FROM
                blog_authors
            WHERE
                id = $1
        `,
        [id],
    );

    if (result instanceof Error) {
        return result;
    }
}
