import {uploadToBunny} from "~/backend/bunny.server";
import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import type {Integer, Uuid} from "~/common--type-definitions/typeDefinitions";
import {
    getNonEmptyStringFromUnknown,
    safeParse,
} from "~/global-common-typescript/utilities/typeValidationUtilities";
import {
    generateUuid,
    getCurrentIsoTimestamp,
    getSingletonValue,
} from "~/global-common-typescript/utilities/utilities";
import type {
    Capability,
    Industry,
    Blog,
    BlogMetadata,
} from "~/growth-jockey-common-typescript/typeDefinitions";
import {
    blogCoverImageHeight,
    blogCoverImageWidth,
} from "~/growth-jockey-common-typescript/typeDefinitions";
import {Searcher} from "fast-fuzzy";
import {Cached} from "~/growth-jockey-common-typescript/utilities/functions";
import {
    createSlug,
    findSlug,
    updateSlug,
} from "~/growth-jockey-common-typescript/server/slugs.server";
import {slugStatus} from "~/growth-jockey-common-typescript/constants/enum";
import {Result, errResult, okResult} from "~/growth-jockey-common-typescript/utilities/errorHandling";

// TTL in milliseconds -> 1 hour = 3600000ms
const ttl = 3600000;
const blogMetadataDbKeys = [
    "last_updated_at",
    "title",
    "subtitle",
    "cover_image",
    "author_id",
    "related_verticals",
    "related_capabilities",
    "related_industries",
    "seo_title",
    "seo_description",
    "seo_image",
];

// TODO: Handle duplication between getBlogMetadata and getBlogMetadataForIds?

// Enumerate functions
function rowToBlogMetadata(row: unknown): BlogMetadata {
    const blogMetadata: BlogMetadata = {
        id: row["id"],
        createdAt: row["created_at"],
        lastUpdatedAt: row["last_updated_at"],
        title: row["title"],
        subtitle: row["subtitle"],
        coverImage: row["cover_image"],
        authorId: row["author_id"],
        relatedVerticals: row["related_verticals"],
        relatedCapabilities: row["related_capabilities"],
        relatedIndustries: row["related_industries"],
        slug: row["slug"],
        seoTitle: row["seo_title"],
        seoDescription: row["seo_description"],
        seoImage: row["seo_image"],
    };

    return blogMetadata;
}

export async function fetchAllBlogMetadatas(
    limit: Integer,
    offset: Integer,
): Promise<Array<BlogMetadata> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    // TODO: Change the logic back to DESC after we get all blog images
    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.id,
                blogs.created_at,
                ${blogMetadataDbKeys.join(", ")},
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                blog_slugs.status = 'ACTIVE'
            ORDER BY
                -- last_updated_at DESC
                last_updated_at ASC
            LIMIT
                $1
            OFFSET
                $2
        `,
        [limit, offset],
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToBlogMetadata(row));
}

export async function fetchBlogMetadata(
    blogId: Uuid,
): Promise<BlogMetadata | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.id,
                blogs.created_at,
                ${blogMetadataDbKeys.join(", ")},
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                blogs.id = $1
                AND blog_slugs.status = 'ACTIVE'
        `,
        [blogId],
    );

    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    const row = getSingletonValue(result.rows);

    return rowToBlogMetadata(row);
}

export async function getBlogMetadatasForIds(
    blogIds: Array<Uuid>,
): Promise<Array<BlogMetadata> | Error> {
    const blogs = [];

    for (const blogId of blogIds) {
        const blog = await getBlogMetadata(blogId as Uuid);

        if (blog instanceof Error || blog == null) {
            continue;
        }

        blogs.push(blog);
    }

    return blogs;
}

export const getAllBlogMetadatas = async (limit: Integer, offset: Integer) =>
    Cached(
        `blogMetadata/all/${limit}/${offset}`,
        async () => {
            return await fetchAllBlogMetadatas(limit, offset);
        },
        ttl,
    );

export const getBlogMetadata = async (id: Uuid) =>
    Cached(
        `blogMetadata/id/${id}`,
        async () => {
            return await fetchBlogMetadata(id);
        },
        ttl,
    );

// function getBlogMetadataFromCache(blogId: Uuid): BlogMetadata | null {
//     const ttl = 3600000;
//     const keyPrefix = "blogMetadata/slug/";

//     const ttlCache = getTtlCache();

//     return ttlCache.get(keyPrefix + blogId) ?? null;
// }

// function setBlogMetadataInCache(blogId: Uuid, blogMetadata: BlogMetadata) {
//     const ttl = 3600000;
//     const keyPrefix = "blogMetadata/id/";

//     const ttlCache = getTtlCache();

//     ttlCache.set(keyPrefix + blogId, );
// }

// Get functions
function rowToBlog(row: unknown): Blog {
    const blog: Blog = {
        id: row["id"],
        createdAt: row["created_at"],
        lastUpdatedAt: row["last_updated_at"],
        title: row["title"],
        subtitle: row["subtitle"],
        coverImage: row["cover_image"],
        authorId: row["author_id"],
        buildingBlocks: row["building_blocks"],
        relatedVerticals: row["related_verticals"],
        relatedCapabilities: row["related_capabilities"],
        relatedIndustries: row["related_industries"],
        slug: row["slug"],
        seoTitle: row["seo_title"],
        seoDescription: row["seo_description"],
        seoImage: row["seo_image"],
    };

    return blog;
}

export async function getAllBlogs(
    limit: Integer,
    offset: Integer,
): Promise<Array<Blog> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    // TODO: Change the logic back to DESC after we get all blog images
    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.*,
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                blog_slugs.status = 'ACTIVE'
            ORDER BY
                -- last_updated_at DESC
                last_updated_at ASC
            LIMIT
                $1
            OFFSET
                $2
        `,
        [limit, offset],
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToBlog(row));
}

export async function fetchBlog(blogId: Uuid): Promise<Blog | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.*,
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
            ON
                blogs.id = blog_slugs.blog_id
            WHERE
                blogs.id = $1
                AND blog_slugs.status = 'ACTIVE'
        `,
        [blogId],
    );

    if (result instanceof Error) {
        return result;
    }

    const row = getSingletonValue(result.rows);

    return rowToBlog(row);
}

export const getBlog = async (id: Uuid) =>
    Cached(
        `blog/id/${id}`,
        async () => {
            return await fetchBlog(id);
        },
        ttl,
    );

export async function getBlogForSlug(
    slug: string,
): Promise<Blog | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
        SELECT
            blogs.*,
            blog_slugs.slug
        FROM blogs
            INNER JOIN blog_slugs
            ON blogs.id = blog_slugs.blog_id
        WHERE
            blogs.id = (
                SELECT blog_id FROM blog_slugs WHERE slug = $1
            )
            AND blog_slugs.status = 'ACTIVE'
        `,
        [slug],
    );

    if (result instanceof Error) {
        return result;
    }

    if(result.rows.length === 0) {
        return null;
    }

    const row = getSingletonValue(result.rows);

    return rowToBlog(row);
}

export async function getBlogsForIds(
    blogIds: Array<Uuid>,
): Promise<Array<Blog> | Error> {
    const blogs = [];

    for (const blogId of blogIds) {
        const blog = await getBlog(blogId as Uuid);

        if (blog == null || blog instanceof Error) {
            continue;
        }

        blogs.push(blog);
    }

    return blogs;
}

// Others
export async function getRelatedBlogsForIndustry(
    industry: Industry,
): Promise<Array<Blog> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.*,
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                related_industries::JSONB ? $1
                AND blog_slugs.status = 'ACTIVE'
            ORDER BY
                last_updated_at DESC
        `,
        [industry.id],
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToBlog(row));
}

export async function getRelatedBlogsForCapability(
    capability: Capability,
): Promise<Array<Blog> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.*,
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                related_capabilities::JSONB ? $1
                AND blog_slugs.status = 'ACTIVE'
            ORDER BY
                last_updated_at desc
        `,
        [capability.id],
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToBlog(row));
}

// function getBlogMinimalInfo1FromBlog(blog: Blog): BlogMinimalInfo1 {
//     const blogMinimalInfo1: BlogMinimalInfo1 = {
//         title: blog.title,
//         slug: blog.slug,
//         subtitle: blog.subtitle,
//     };

//     return blogMinimalInfo1;
// }

// function getBlogMinimalInfo4FromBlog(blog: Blog): BlogMinimalInfo4 {
//     const blogMinimalInfo4: BlogMinimalInfo4 = {
//         id: blog.id,
//         title: blog.title,
//         slug: blog.slug,
//         subtitle: blog.subtitle,
//         relatedVerticals: blog.relatedVerticals,
//     };

//     return blogMinimalInfo4;
// }

export async function getHeaderBlogTeasers(): Promise<
    Array<BlogMetadata> | Error
> {
    const blogs = await getBlogMetadatasForIds([
        "2d6511ee-5d7d-4c3e-8d06-8c005baf8cad" as Uuid,
        "185bfaf6-9593-4c76-9559-12e2c7e36e44" as Uuid,
    ]);

    if (blogs instanceof Error) {
        return blogs;
    }

    return blogs;
}

/* export async function getSection1PinnedBlogs(): Promise<Array<Blog> | Error> {
    return getBlogsForIds([
        "70071475-7a9a-4091-bfcf-b06d78c4d479" as Uuid,
        "9d6a5727-a0cb-45f1-9ee7-35f2a204c2c8" as Uuid,
        "9cf9ef1c-1de6-4f44-972b-3afa3a05b6c1" as Uuid,
        "201d88c3-d9ba-4da8-8a41-ec145a1683bf" as Uuid,
        "57743199-c295-470b-ba5d-8e839a39babc" as Uuid,
        "14d52cd6-5d20-46c9-82dd-b711b29b91aa" as Uuid,
    ]);
} */

export async function getSection1PinnedBlogs(): Promise<
    Array<BlogMetadata> | Error
> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }
    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.id,
                blogs.created_at,
                ${blogMetadataDbKeys.join(", ")},
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                blog_slugs.status = 'ACTIVE'
            ORDER BY
                last_updated_at DESC
            LIMIT
                6
        `,
    );
    if (result instanceof Error) {
        return result;
    }
    return result.rows.map((row: unknown) => rowToBlogMetadata(row));
}

export async function getSearchedBlogs(
    searchQuery: string,
    // page and pageSize are 1-indexed
    // page is the current page number
    page: Integer = 1,
    // pageSize is the number of items per page and its maximum value is 20
    pageSize: Integer = 10,
): Promise<{blogs: Array<BlogMetadata>; count: Integer} | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }
    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.id,
                blogs.created_at,
                ${blogMetadataDbKeys.join(", ")},
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                blog_slugs.status = 'ACTIVE'
            ORDER BY
                last_updated_at DESC
        `,
    );
    if (result instanceof Error) {
        return result;
    }
    if (result.rows.length === 0) {
        return {blogs: [], count: 0};
    }
    const results: BlogMetadata[] = result.rows.map((row: unknown) =>
        rowToBlogMetadata(row),
    );
    const searcher = new Searcher(results, {
        threshold: 0.5,
        ignoreCase: true,
        ignoreSymbols: true,
        ignoreNumbers: true,
        ignoreStopWords: true,
        // use blog title and subtitle as the search key
        keySelector: (blog) => `${blog.title} ${blog.subtitle}`,
    });
    const searchResult = searcher.search(searchQuery);
    if (searchResult.length === 0) {
        return {blogs: [], count: 0};
    }
    if (searchResult.length <= pageSize) {
        return {blogs: searchResult, count: searchResult.length};
    }
    if (page * pageSize > searchResult.length) {
        return {
            blogs: searchResult.slice(
                (page - 1) * pageSize,
                searchResult.length,
            ),
            count: searchResult.length,
        };
    }
    return {
        blogs: searchResult.slice((page - 1) * pageSize, page * pageSize),
        count: searchResult.length,
    };
}

export async function getMostReadBlogs(): Promise<Array<Blog> | Error> {
    return getBlogsForIds([
        "1d29cb07-186a-41f0-9885-c43ed82132dd" as Uuid,
        "97bf622a-6ee7-454e-a407-6f31455d2376" as Uuid,
        "48663a40-e49e-4fba-9383-d96ad6af061a" as Uuid,
        "31949f82-8e93-4cb1-9377-fe528962bce9" as Uuid,
    ]);
}

export async function getPopularBlogs(): Promise<Array<Blog> | Error> {
    return getBlogsForIds([
        "aca16546-80ba-447f-ab63-735611fe3e0b" as Uuid,
        "a0909784-7d90-4363-b718-5256a07ff523" as Uuid,
        "9cf9ef1c-1de6-4f44-972b-3afa3a05b6c1" as Uuid,
        "888b4aa1-72df-410b-82b0-9569e66645f2" as Uuid,
    ]);
}

export async function getSection2PinnedBlogs(): Promise<Array<Blog> | Error> {
    return getBlogsForIds([
        "a75d335e-527d-4fc8-9cbf-f94a81a84924" as Uuid,
        "70616ceb-29d0-41e7-9b60-c0852aabee1e" as Uuid,
        "997221d4-893b-4824-811a-d4089711f1a1" as Uuid,
        "bc0f95bf-1212-4270-a4c5-97059d53eeb0" as Uuid,
        "5071640a-894c-4cf6-a6b6-8c68582043c5" as Uuid,
        "7c52f185-3635-42f3-9bdd-c02579516614" as Uuid,
        "066212ff-a2ca-4214-aaf8-dc81913e02bd" as Uuid,
        "ca7310af-2819-4e7c-8a31-bfda2057b93f" as Uuid,
        "dac8136a-629c-4606-a9e9-4cc0e069e46d" as Uuid,
        "49f9845e-976d-450c-8149-80e8e23b83d9" as Uuid,
        "2cd5007d-fe81-4374-9909-63589682612f" as Uuid,
        "b68b47c2-c4a0-48a7-a9d4-a20e35ce8105" as Uuid,
    ]);
}

export async function getFeaturedBlogs(): Promise<Array<Blog> | Error> {
    return getBlogsForIds(["57743199-c295-470b-ba5d-8e839a39babc" as Uuid]);
}

export async function getTotalNumberOfBlogs(): Promise<Integer | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                COUNT(*) AS count
            FROM
                blogs
        `,
    );

    if (result instanceof Error) {
        return result;
    }

    const row = getSingletonValue(result.rows);

    // TODO: Validation

    return row.count;
}

export async function getHomePageTrendingInsightsBlogs(): Promise<
    BlogMetadata[] | Error
> {
    const blogs = await getBlogMetadatasForIds([
        "97340791-2d96-43da-b700-e0f84ffb8833" as Uuid,
        "09c23967-699f-49f7-8020-3a9c28beb434" as Uuid,
        "0ef6a4c1-fa0e-49dd-bd1c-73bf6860b593" as Uuid,
        "97340791-2d96-43da-b700-e0f84ffb8833" as Uuid,
        "09c23967-699f-49f7-8020-3a9c28beb434" as Uuid,
        "0ef6a4c1-fa0e-49dd-bd1c-73bf6860b593" as Uuid,
    ]);

    if (blogs instanceof Error) {
        return blogs;
    }

    // TODO: This looks incorrect. Verify.
    shuffleBlogs(blogs);

    return blogs;
}

export async function getHomePageSection1Blogs(): Promise<
    BlogMetadata[] | Error
> {
    const blogs = await getBlogMetadatasForIds([
        "e539fa0b-518f-4066-8641-54f0a1984903" as Uuid,
        "5156170e-21ca-4b7a-b979-1d3f723010b8" as Uuid,
        "0aa0f2f5-109f-402c-8394-690afc1c2bbb" as Uuid,
        "93a3ca78-757f-4666-a135-ec30a7451ad2" as Uuid,
    ]);

    if (blogs instanceof Error) {
        return blogs;
    }

    // TODO: This looks incorrect. Verify.
    shuffleBlogs(blogs);

    return blogs;
}

export async function getHomePageSection2Blogs(): Promise<
    BlogMetadata[] | Error
> {
    const blogs = await getBlogMetadatasForIds([
        "573dcb21-6fd2-4106-a510-41b834039b64" as Uuid,
        "30f8b366-c19c-4a51-bf49-d9d3cfce3107" as Uuid,
        "62613e03-50f0-4fbc-9bac-439c49728329" as Uuid,
        "58d7b887-0ea4-4b59-a81c-aa65d359b9ec" as Uuid,
        "4b96504f-13dc-4572-9da8-1fbb2740f817" as Uuid,
        "70071475-7a9a-4091-bfcf-b06d78c4d479" as Uuid,
    ]);

    if (blogs instanceof Error) {
        return blogs;
    }

    // TODO: This looks incorrect. Verify.
    shuffleBlogs(blogs);

    return blogs;
}

export async function getHomePageSection3Blogs(): Promise<
    BlogMetadata[] | Error
> {
    const blogs = await getBlogMetadatasForIds([
        "e8e3ac83-92d7-4af2-a646-f8ee15ba2e12" as Uuid,
        "70616ceb-29d0-41e7-9b60-c0852aabee1e" as Uuid,
        "ed3667c0-c7e7-4e38-9b07-f91a0af413b4" as Uuid,
        "6ea5ddbe-bb0c-414b-8f1d-803aa0e96063" as Uuid,
        "97340791-2d96-43da-b700-e0f84ffb8833" as Uuid,
        "0ef6a4c1-fa0e-49dd-bd1c-73bf6860b593" as Uuid,
    ]);

    if (blogs instanceof Error) {
        return blogs;
    }

    // TODO: This looks incorrect. Verify.
    shuffleBlogs(blogs);

    return blogs;
}

export async function getHomePageLatestupdatesBlogs(): Promise<
    BlogMetadata[] | Error
> {
    const blogs = await getBlogMetadatasForIds([
        "30f8b366-c19c-4a51-bf49-d9d3cfce3107" as Uuid,
        "62613e03-50f0-4fbc-9bac-439c49728329" as Uuid,
        "4b96504f-13dc-4572-9da8-1fbb2740f817" as Uuid,
        "70071475-7a9a-4091-bfcf-b06d78c4d479" as Uuid,
        "e8e3ac83-92d7-4af2-a646-f8ee15ba2e12" as Uuid,
        "ed3667c0-c7e7-4e38-9b07-f91a0af413b4" as Uuid,
    ]);

    if (blogs instanceof Error) {
        return blogs;
    }

    // TODO: This looks incorrect. Verify.
    shuffleBlogs(blogs);

    return blogs;
}

function shuffleBlogs(blogs: Array<BlogMetadata>): Array<BlogMetadata> {
    const shuffledArray = blogs.slice();
    const randomBlogsForSection: Array<BlogMetadata> = [];

    // Shuffle the array using the Fisher-Yates algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ];
    }

    // Select the first 'count' blogs from the shuffled array
    for (let i = 0; i < shuffledArray.length; i++) {
        if (shuffledArray[i]) {
            randomBlogsForSection.push(shuffledArray[i]);
        }
    }

    return shuffledArray;
}

// CRUD - C
export async function createBlog(
    blog: Blog,
    coverImageFile: File,
): Promise<Result<void>> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return errResult(postgresDatabaseManager);
    }

    // check if the slug exists in the 'slugs' table
    const slugRecord = await findSlug({slug: blog.slug});
    if (slugRecord instanceof Error) {
        return errResult(slugRecord);
    }

    if (slugRecord !== null) {
        if (slugRecord.status === slugStatus.ACTIVE) {
            return errResult(new Error("Slug already exists"));
        }
    }

    const currentTimestamp = getCurrentIsoTimestamp();

    const hash = generateUuid().slice(0, 6);
    const coverImageRelativePath = `/blogs/${blog.id}/cover-${hash}.jpg`;

    // TODO: Shift to env variable, and regenerate key
    const uploadResult = await uploadToBunny(
        coverImageFile,
        `https://storage.bunnycdn.com/growthjockey-user-generated${coverImageRelativePath}`,
        "6f60b4ac-6241-4eee-b162501c65ec-2862-497e",
    );
    if (uploadResult instanceof Error) {
        return errResult(uploadResult);
    }

    const result = await postgresDatabaseManager.execute(
        `
            INSERT INTO blogs(
                id,
                created_at,
                last_updated_at,
                title,
                subtitle,
                cover_image,
                author_id,
                building_blocks,
                related_verticals,
                related_industries,
                related_capabilities,
                seo_title,
                seo_description,
                seo_image
            )
            VALUES(
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
                $14
            )
        `,
        [
            blog.id,
            currentTimestamp,
            currentTimestamp,
            blog.title,
            blog.subtitle,
            {
                width: blogCoverImageWidth,
                height: blogCoverImageHeight,
                variants: [
                    {
                        width: blogCoverImageWidth,
                        height: blogCoverImageHeight,
                        url: `https://growthjockey-user-generated.b-cdn.net${coverImageRelativePath}`,
                    },
                ],
            },
            blog.authorId,
            JSON.stringify(blog.buildingBlocks),
            JSON.stringify(blog.relatedVerticals),
            JSON.stringify(blog.relatedIndustries),
            JSON.stringify(blog.relatedCapabilities),
            safeParse(getNonEmptyStringFromUnknown, blog.seoTitle),
            safeParse(getNonEmptyStringFromUnknown, blog.seoDescription),
            // TODO: Handle empty case properly
            // blog.seoImage,
            null,
        ],
    );

    if (result instanceof Error) {
        return errResult(result);
    }

    // if slug entry is null, insert a new entry
    // else update the existing entry,
    let slugManipulationResult;
    if (slugRecord === null) {
        slugManipulationResult = await createSlug({
            slug: blog.slug,
            blog_id: blog.id,
        });
    } else {
        slugManipulationResult = await updateSlug(
            {id: slugRecord.id},
            {
                status: slugStatus.ACTIVE,
                blog_id: blog.id,
            },
        );
    }

    if (slugManipulationResult instanceof Error) {
        return errResult(slugManipulationResult);
    }

    return okResult(undefined);
}

export async function updateBlog(
    blog: Blog,
    coverImageFile: File | null,
): Promise<Result<void>> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return errResult(postgresDatabaseManager);
    }

    // check if the slug exists in the 'slugs' table
    const slugRecord = await findSlug({slug: blog.slug});

    if (slugRecord instanceof Error) {
        return errResult(slugRecord);
    }

    if (slugRecord !== null) {
        if (
            slugRecord.status === slugStatus.ACTIVE &&
            slugRecord.blog_id !== blog.id
        ) {
            return errResult(new Error("Slug already exists"));
        }
    }

    const currentTimestamp = getCurrentIsoTimestamp();

    let coverImageRelativePath: string | null;
    if (coverImageFile == null) {
        coverImageRelativePath = null;
    } else {
        const hash = generateUuid().slice(0, 6);
        coverImageRelativePath = `/growthjockey/user-generated/blogs/${blog.id}/cover-${hash}.jpg`;

        const uploadResult = await uploadToBunny(
            coverImageFile,
            `https://storage.bunnycdn.com/growthjockey-user-generated${coverImageRelativePath}`,
            "6f60b4ac-6241-4eee-b162501c65ec-2862-497e",
        );
        if (uploadResult instanceof Error) {
            return errResult(uploadResult);
        }
    }

    const result = await postgresDatabaseManager.execute(
        `
            UPDATE
                blogs
            SET
                last_updated_at = $2,
                title = $3,
                subtitle = $4,
                cover_image = $5,
                author_id = $6,
                building_blocks = $7,
                related_verticals = $8,
                related_industries = $9,
                related_capabilities = $10,
                seo_title = $11,
                seo_description = $12,
                seo_image = $13
            WHERE
                id = $1
            ;
        `,
        [
            blog.id,
            currentTimestamp,
            blog.title,
            blog.subtitle,
            coverImageRelativePath == null
                ? JSON.stringify(blog.coverImage)
                : JSON.stringify({
                      width: blogCoverImageWidth,
                      height: blogCoverImageHeight,
                      variants: [
                          {
                              width: blogCoverImageWidth,
                              height: blogCoverImageHeight,
                              url: `https://growthjockey-user-generated.b-cdn.net${coverImageRelativePath}`,
                          },
                      ],
                  }),
            blog.authorId,
            JSON.stringify(blog.buildingBlocks),
            JSON.stringify(blog.relatedVerticals),
            JSON.stringify(blog.relatedIndustries),
            JSON.stringify(blog.relatedCapabilities),
            blog.seoTitle,
            blog.seoDescription,
            blog.seoImage,
        ],
    );

    if (result instanceof Error) {
        return errResult(result);
    }

    // if slug entry is null, insert a new entry
    // else update the existing entry
    // also update the old slug entry to PASSIVE
    let slugManipulationResult, previousSlugManipulationResult;
    if (slugRecord === null) {
        // make the previous slug to PASSIVE
        previousSlugManipulationResult = await updateSlug(
            {blog_id: blog.id, status: slugStatus.ACTIVE},
            {status: slugStatus.PASSIVE},
        );
        // create a new slug entry
        slugManipulationResult = await createSlug({
            slug: blog.slug,
            blog_id: blog.id,
        });
    } else {
        if (
            slugRecord.status === slugStatus.ACTIVE &&
            slugRecord.blog_id === blog.id
        ) {
            // if the slug is active and that too for the same blog, then do nothing
            return okResult(undefined);
        } else if (
            slugRecord.status === slugStatus.PASSIVE &&
            slugRecord.blog_id === blog.id
        ) {
            // if the slug is passive and that too for the same blog
            // make previous slug to PASSIVE
            previousSlugManipulationResult = await updateSlug(
                {blog_id: blog.id, status: slugStatus.ACTIVE},
                {status: slugStatus.PASSIVE},
            );
            // make the current slug to ACTIVE
            slugManipulationResult = await updateSlug(
                {id: slugRecord.id},
                {status: slugStatus.ACTIVE},
            );
        } else if (
            slugRecord.status === slugStatus.PASSIVE &&
            slugRecord.blog_id !== blog.id
        ) {
            // if the slug is passive and that too for a different blog
            // make the previous slug to ACTIVE
            previousSlugManipulationResult = await updateSlug(
                {
                    blog_id: blog.id,
                    status: slugStatus.ACTIVE,
                },
                {status: slugStatus.PASSIVE},
            );
            // make the current slug to ACTIVE
            slugManipulationResult = await updateSlug(
                {id: slugRecord.id},
                {
                    status: slugStatus.ACTIVE,
                    blog_id: blog.id,
                },
            );
        }
    }

    if (slugManipulationResult instanceof Error) {
        return errResult(slugManipulationResult);
    }

    if (previousSlugManipulationResult instanceof Error) {
        return errResult(previousSlugManipulationResult);
    }

    return okResult(undefined);
}

export async function getLatestBlogs(
    count: number,
): Promise<Array<BlogMetadata> | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    // TODO: Change the logic back to DESC after we get all blog images
    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                blogs.id,
                blogs.created_at,
                ${blogMetadataDbKeys.join(", ")},
                blog_slugs.slug
            FROM
                blogs
            INNER JOIN
                blog_slugs
                ON blogs.id = blog_slugs.blog_id
            WHERE
                blog_slugs.status = 'ACTIVE'
            ORDER BY
                last_updated_at DESC
            LIMIT
                $1
        `,
        [count],
    );

    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToBlogMetadata(row));
}

// import {Blog, BlogAuthor, BlogBuildingBlockType} from "~/growth-jockey-common-typescript/typeDefinitions";
// import {Integer, Uuid} from "~/common--type-definitions/typeDefinitions";
// import {getCurrentIsoTimestamp, getCurrentTimestamp, getSingletonValue, getSingletonValueOrNull} from "~/global-common-typescript/utilities/utilities";
// import {execute} from "~/common--database-manager--postgres/postgresDatabaseManager.server";

// // Force tailwind to create relevant classes
// // className="tw-grid-cols-1 lg:tw-grid-cols-[minmax(0,1fr)_2rem_32rem]"
// // '[{"typeId":"d7995fb1-4fbc-429a-9916-a4daab5fbd1b","className":"tw-row-start-1 lg:tw-row-start-1 lg:tw-col-start-1","content":null},{"typeId":"090d4def-1e2b-454a-857f-99b9d8bba11b","className":"tw-row-start-2 lg:tw-row-start-2 lg:tw-col-start-1","content":null},{"typeId":"a69b2cc8-673f-4d19-a836-671fd5bd7a9f","className":"tw-row-start-3 lg:tw-row-start-3 lg:tw-col-start-1","content":"1rem"},{"typeId":"d2506c66-6140-4c77-8792-35b3a61b9a24","className":"tw-row-start-4 lg:tw-row-start-4 lg:tw-col-start-1","content":"With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide."},{"typeId":"0e9e2f69-4382-41af-b7b2-2fa1f305afe5","className":"tw-row-start-14 lg:tw-row-start-4 lg:tw-col-start-3 tw-pt-24 lg:tw-pt-0","content":null},{"typeId":"a69b2cc8-673f-4d19-a836-671fd5bd7a9f","className":"tw-row-start-5 lg:tw-row-start-5 lg:tw-col-start-1","content":"4rem"},{"typeId":"1e4f769e-27b9-49ff-90b4-8c09e9e228f2","className":"tw-row-start-6 lg:tw-row-start-6 lg:tw-col-start-1","content":null},{"typeId":"a69b2cc8-673f-4d19-a836-671fd5bd7a9f","className":"tw-row-start-7 lg:tw-row-start-7 lg:tw-col-start-1","content":"4rem"},{"typeId":"d2506c66-6140-4c77-8792-35b3a61b9a24","className":"tw-row-start-9 lg:tw-row-start-8 lg:tw-col-start-1","content":"With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide."},{"typeId":"552a96dc-5c95-49fd-9bff-ae4d6e86b15e","className":"tw-row-start-8 lg:tw-row-start-8 lg:tw-col-start-3","content":"/assets/blogs/5.jpg"},{"typeId":"a69b2cc8-673f-4d19-a836-671fd5bd7a9f","className":"tw-row-start-10 lg:tw-row-start-9 lg:tw-col-start-1","content":"4rem"},{"typeId":"dbefd5b1-c8ec-4a23-b470-d545184ed41c","className":"tw-row-start-11 lg:tw-row-start-10 lg:tw-col-start-1","content":"Intentional futurists are the kind of leaders who will not just survive, but thrive, as the world continues to change rapidly and radically."},{"typeId":"a69b2cc8-673f-4d19-a836-671fd5bd7a9f","className":"tw-row-start-12 lg:tw-row-start-11 lg:tw-col-start-1","content":"4rem"},{"typeId":"d2506c66-6140-4c77-8792-35b3a61b9a24","className":"tw-row-start-13 lg:tw-row-start-12 lg:tw-col-start-1","content":"With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide.With our advertising and marketing services, your business will be discovered world wide. With our advertising and marketing services, your business will be. With our advertising and marketing services, your business will be discovered world wide."}]'

// export async function getBlog(blogId: Uuid): Promise<Blog | null> {
//     const result = await execute(
//         `
//             SELECT
//                 *
//             FROM
//                 blogs
//             WHERE
//                 id = $1
//         `,
//         [blogId],
//     );

//     const row = getSingletonValue(result.rows);

//     return rowToBlog(row);
// }

// export async function getBlogs(limit: number, offset: number): Promise<Array<Blog>> {
//     const result = await execute(
//         `
//             SELECT
//                 *
//             FROM
//                 blogs
//             ORDER BY
//                 created_at
//             LIMIT
//                 $1
//             OFFSET
//                 $2
//         `,
//         [limit, limit * offset],
//     );

//     return result.rows.map((row) => rowToBlog(row));
// }

// // TODO: Figure out a better way to keep the enum and the db in sync
// // async function getBlogBuildingBlockTypes() {
// //     return [
// //         // {
// //         //     id: "f094b34d-fd03-4481-a471-486892056e3f",
// //         //     name: "Cover Image",
// //         // },
// //         {
// //             id: "d7995fb1-4fbc-429a-9916-a4daab5fbd1b",
// //             name: "Title",
// //         },
// //         {
// //             id: "090d4def-1e2b-454a-857f-99b9d8bba11b",
// //             name: "Subtitle",
// //         },
// //         {
// //             id: "d2506c66-6140-4c77-8792-35b3a61b9a24",
// //             name: "Text",
// //         },
// //         {
// //             id: "552a96dc-5c95-49fd-9bff-ae4d6e86b15e",
// //             name: "Image",
// //         },
// //         {
// //             id: "0e9e2f69-4382-41af-b7b2-2fa1f305afe5",
// //             name: "About the Author",
// //         },
// //         {
// //             id: "a69b2cc8-673f-4d19-a836-671fd5bd7a9f",
// //             name: "Vertical Spacer",
// //         },
// //         {
// //             id: "1e4f769e-27b9-49ff-90b4-8c09e9e228f2",
// //             name: "Random Related Blogs",
// //         },
// //         {
// //             id: "dbefd5b1-c8ec-4a23-b470-d545184ed41c",
// //             name: "Quote",
// //         },
// //     ];
// // }

// // async function getBlogBuildingBlockType(buildingBlockId: Uuid): Promise<BlogBuildingBlockType> {
// //     return getSingletonValue((await getBlogBuildingBlockTypes()).filter((buildingBlock) => buildingBlock.id == buildingBlockId));
// // }

// async function getBlogAuthor(blogAuthorId: Uuid): Promise<BlogAuthor | null> {
//     const result = await execute(
//         `
//             SELECT
//                 *
//             FROM
//                 blog_authors
//             WHERE
//                 id = $1
//         `,
//         [blogAuthorId],
//     );

//     const row = getSingletonValue(result.rows);

//     return rowToBlogAuthor(row);
// }

// // export type BlogTemplate = {
// //     id: Uuid;
// //     name: string;
// // };

// // export async function getBlogTemplate(blogTemplateId: Uuid): Promise<BlogTemplate | null> {
// //     const blogTemplates = await getBlogBlogTemplates();

// //     return getSingletonValueOrNull(blogTemplates.filter((blogTemplate) => blogTemplate.id == blogTemplateId));
// // }

// // async function getBlogBlogTemplates(): Promise<Array<BlogTemplate>> {
// //     return [
// //         {
// //             id: "19d1eb8e-55bb-47f3-8940-6342c6ff7f69",
// //             name: "Standard",
// //         },
// //     ];
// // }

// async function rowToBlog(row: unknown): Promise<Blog> {
//     const blog: Blog = {
//         id: row["id"],
//         createdAt: row["created_at"],
//         lastUpdatedAt: row["last_updated_at"],
//         title: row["title"],
//         subtitle: row["subtitle"],
//         shortDescription: row["short_description"],
//         authorId: row["author_id"],
//         gridBreakpoints: row["grid_breakpoints"],
//         gridDetails: row["grid_details"],
//         buildingBlocks: row["building_blocks"],
//     };

//     return blog;
// }
