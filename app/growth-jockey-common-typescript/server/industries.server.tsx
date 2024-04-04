import {z as zod} from "zod";
import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import {getUuidFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";
import {getSingletonValue} from "~/global-common-typescript/utilities/utilities";
import {
    getBlogMetadata,
    getBlogMetadatasForIds,
} from "~/growth-jockey-common-typescript/server/blogs.server";
import type {
    Industry,
    IndustryBackendRepresentation,
    IndustryMetadata,
} from "~/growth-jockey-common-typescript/typeDefinitions";
import {industryRowValidator} from "~/growth-jockey-common-typescript/utilities/zodValidationPatterns";
import {PerfTimer} from "~/server/utilities.server";

export async function enumerateIndustry(
    industrySlug: string,
): Promise<IndustryMetadata | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                id,
                slug,
                human_readable_name
            FROM
                industries
            WHERE
                slug = $1
        `,
        [industrySlug],
    );
    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    return rowToIndustryMetadata(getSingletonValue(result.rows));
}

export async function enumerateAllIndustries(): Promise<
    Array<IndustryMetadata> | Error
> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                id,
                slug,
                human_readable_name
            FROM
                industries
        `,
    );
    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToIndustryMetadata(row));
}

export async function getIndustry(
    industrySlug: string,
): Promise<Industry | null | Error> {
    const perfTimer = new PerfTimer("Data fetch: Industry");

    const industryBackendRepresentation =
        await getIndustryBackendRepresentation(industrySlug);
    if (industryBackendRepresentation instanceof Error) {
        return industryBackendRepresentation;
    }
    if (industryBackendRepresentation == null) {
        return null;
    }

    perfTimer.lap();

    const teaserBlogs = await getBlogMetadatasForIds(
        industryBackendRepresentation.industryPageContent.teaserBlogs,
    );
    if (teaserBlogs instanceof Error) {
        return teaserBlogs;
    }

    perfTimer.lap();

    const superFeaturedBlog = await getBlogMetadata(
        industryBackendRepresentation.industryPageContent.superTeaserBlog,
    );
    if (superFeaturedBlog instanceof Error) {
        return superFeaturedBlog;
    }
    if (superFeaturedBlog == null) {
        return new Error("42e9bba6-dc28-4efe-af4b-e630c4b2598e");
    }

    perfTimer.lap();

    const whatWeThinkBlogs = await getBlogMetadatasForIds(
        industryBackendRepresentation.industryPageContent.whatWeThinkBlogs,
    );
    if (whatWeThinkBlogs instanceof Error) {
        return whatWeThinkBlogs;
    }

    perfTimer.lap();

    const latestUpdatesBlogs = await getBlogMetadatasForIds(
        industryBackendRepresentation.industryPageContent.latestUpdatesBlogs,
    );
    if (latestUpdatesBlogs instanceof Error) {
        return latestUpdatesBlogs;
    }

    perfTimer.lap();

    const relatedArticleBlogs = await getBlogMetadatasForIds(
        industryBackendRepresentation.industryPageContent.relatedArticleBlogs,
    );
    if (relatedArticleBlogs instanceof Error) {
        return relatedArticleBlogs;
    }

    perfTimer.lap();

    const industry: Industry = {
        id: industryBackendRepresentation.id,
        slug: industryBackendRepresentation.slug,
        humanReadableName: industryBackendRepresentation.humanReadableName,
        industryPageContent: {
            metaTitle:
                industryBackendRepresentation.industryPageContent.metaTitle,
            metaDescription:
                industryBackendRepresentation.industryPageContent
                    .metaDescription,
            structuredData:
                industryBackendRepresentation.industryPageContent
                    .structuredData,

            coverImageDesktop:
                industryBackendRepresentation.industryPageContent
                    .coverImageDesktop,
            coverImageMobile:
                industryBackendRepresentation.industryPageContent
                    .coverImageMobile,
            heroSectionH1:
                industryBackendRepresentation.industryPageContent.heroSectionH1,
            heroSectionH2:
                industryBackendRepresentation.industryPageContent.heroSectionH2,

            introductionSectionH1:
                industryBackendRepresentation.industryPageContent
                    .introductionSectionH1,
            introductionSectionH2:
                industryBackendRepresentation.industryPageContent
                    .introductionSectionH2,
            introductionSectionContent:
                industryBackendRepresentation.industryPageContent
                    .introductionSectionContent,

            teaserBlogs: teaserBlogs,

            numbersSectionMetrics:
                industryBackendRepresentation.industryPageContent
                    .numbersSectionMetrics,

            detailedContentSectionH1:
                industryBackendRepresentation.industryPageContent
                    .detailedContentSectionH1,
            detailedContentSectionH2:
                industryBackendRepresentation.industryPageContent
                    .detailedContentSectionH2,
            detailedContentSectionContent:
                industryBackendRepresentation.industryPageContent
                    .detailedContentSectionContent,
            detailedContentSectionServices:
                industryBackendRepresentation.industryPageContent
                    .detailedContentSectionServices,

            superTeaserBlog: superFeaturedBlog,

            howGrowthJockeyCanHelpSectionH1:
                industryBackendRepresentation.industryPageContent
                    .howGrowthJockeyCanHelpSectionH1,
            howGrowthJockeyCanHelpSectionH2:
                industryBackendRepresentation.industryPageContent
                    .howGrowthJockeyCanHelpSectionH2,
            howGrowthJockeyCanHelpSectionContent:
                industryBackendRepresentation.industryPageContent
                    .howGrowthJockeyCanHelpSectionContent,
            howGrowthJockeyCanHelpSectionCapabilities:
                industryBackendRepresentation.industryPageContent
                    .howGrowthJockeyCanHelpSectionCapabilities,

            whatWeThinkBlogs: {
                style1Blogs: [whatWeThinkBlogs[0], whatWeThinkBlogs[1]],
                style2Blogs: [
                    whatWeThinkBlogs[2],
                    whatWeThinkBlogs[3],
                    whatWeThinkBlogs[4],
                ],
                style3Blog: whatWeThinkBlogs[5],
            },

            latestUpdatesBlogs: latestUpdatesBlogs,

            relatedArticleBlogs: relatedArticleBlogs,
        },
    };

    perfTimer.end();

    return industry;
}

async function getIndustryBackendRepresentation(
    industrySlug: string,
): Promise<IndustryBackendRepresentation | null | Error> {
    const postgresDatabaseManager = await getPostgresDatabaseManager(null);
    if (postgresDatabaseManager instanceof Error) {
        return postgresDatabaseManager;
    }

    const result = await postgresDatabaseManager.execute(
        `
            SELECT
                id,
                slug,
                human_readable_name,
                page_content
            FROM
                industries
            WHERE
                slug = $1;
        `,
        [industrySlug],
    );

    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    return rowToIndustryBackendRepresentation(getSingletonValue(result.rows));
}

function rowToIndustryMetadata(row: unknown): IndustryMetadata {
    const industryMetadataRowValidator = zod.object({
        id: zod.string().transform((str) => getUuidFromUnknown(str)),
        slug: zod.string(),
        human_readable_name: zod.string(),
    });

    const validatedRow = industryMetadataRowValidator.parse(row);

    const industryMetadata: IndustryMetadata = {
        id: validatedRow.id,
        slug: validatedRow.slug,
        humanReadableName: validatedRow.human_readable_name,
    };

    return industryMetadata;
}

function rowToIndustryBackendRepresentation(
    row: unknown,
): IndustryBackendRepresentation {
    const validatedRow = industryRowValidator.parse(row);

    const industryBackendRepresentation: IndustryBackendRepresentation = {
        id: validatedRow.id,
        slug: validatedRow.slug,
        humanReadableName: validatedRow.human_readable_name,
        industryPageContent: validatedRow.page_content,
    };

    return industryBackendRepresentation;
}
