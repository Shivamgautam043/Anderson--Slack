import {z as zod} from "zod";
import {getPostgresDatabaseManager} from "~/common--database-manager--postgres/postgresDatabaseManager.server";
import {getUuidFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";
import {getSingletonValue} from "~/global-common-typescript/utilities/utilities";
import {getBlogMetadata, getBlogMetadatasForIds} from "~/growth-jockey-common-typescript/server/blogs.server";
import {getCaseStudies} from "~/growth-jockey-common-typescript/server/caseStudies.server";
import {getFaqs} from "~/growth-jockey-common-typescript/server/faqs";
import type {
    Capability,
    CapabilityBackendRepresentation,
    CapabilityMetadata,
} from "~/growth-jockey-common-typescript/typeDefinitions";
import {capabilityRowValidator} from "~/growth-jockey-common-typescript/utilities/zodValidationPatterns";
import {PerfTimer} from "~/server/utilities.server";

export async function enumerateCapability(
    capabilitySlug: string,
): Promise<CapabilityMetadata | null | Error> {
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
                vertical
            FROM
                capabilities
            WHERE
                slug = $1
        `,
        [capabilitySlug],
    );
    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }

    return rowToCapabilityMetadata(getSingletonValue(result.rows));
}

export async function enumerateAllCapabilities(): Promise<
    Array<CapabilityMetadata> | Error
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
                human_readable_name,
                vertical
            FROM
                capabilities
        `,
    );
    if (result instanceof Error) {
        return result;
    }

    return result.rows.map((row) => rowToCapabilityMetadata(row));
}

export async function getCapability(
    capabilitySlug: string,
): Promise<Capability | null | Error> {
    const perfTimer = new PerfTimer("Data fetch: Capability");

    const capabilityBackendRepresentation =
        await getCapabilityBackendRepresentation(capabilitySlug);
    if (capabilityBackendRepresentation instanceof Error) {
        return capabilityBackendRepresentation;
    }
    if (capabilityBackendRepresentation == null) {
        return null;
    }

    perfTimer.lap();

    const introductionSectionFeaturedBlog = await getBlogMetadata(capabilityBackendRepresentation.capabilityPageContent.introductionSectionFeaturedBlog);
    if (introductionSectionFeaturedBlog instanceof Error) {
        return introductionSectionFeaturedBlog;
    }
    if (introductionSectionFeaturedBlog == null) {
        return Error("0b584ae8-3201-4747-8baf-8e79052f759a");
    }

    perfTimer.lap();

    const blogsSectionBlogs = await getBlogMetadatasForIds(
        capabilityBackendRepresentation.capabilityPageContent.blogsSectionBlogs,
    );
    if (blogsSectionBlogs instanceof Error) {
        return blogsSectionBlogs;
    }

    perfTimer.lap();

    const caseStudiesSectionCaseStudies = await getCaseStudies(
        capabilityBackendRepresentation.capabilityPageContent
            .caseStudiesSectionCaseStudies,
    );
    if (caseStudiesSectionCaseStudies instanceof Error) {
        return caseStudiesSectionCaseStudies;
    }

    perfTimer.lap();

    const whatWeThinkStyle1Blogs = await getBlogMetadatasForIds(
        capabilityBackendRepresentation.capabilityPageContent
            .whatWeThinkSectionBlogs.style1Blogs,
    );
    if (whatWeThinkStyle1Blogs instanceof Error) {
        return whatWeThinkStyle1Blogs;
    }

    perfTimer.lap();

    const whatWeThinkStyle2Blogs = await getBlogMetadatasForIds(
        capabilityBackendRepresentation.capabilityPageContent
            .whatWeThinkSectionBlogs.style2Blogs,
    );
    if (whatWeThinkStyle2Blogs instanceof Error) {
        return whatWeThinkStyle2Blogs;
    }

    perfTimer.lap();

    const whatWeThinkStyle3Blog = await getBlogMetadata(capabilityBackendRepresentation.capabilityPageContent.whatWeThinkSectionBlogs.style3Blog);
    if (whatWeThinkStyle3Blog instanceof Error) {
        return whatWeThinkStyle3Blog;
    }
    if (whatWeThinkStyle3Blog == null) {
        return Error("2ac04c25-ef68-4926-91ec-4ad5503a1da7");
    }

    perfTimer.lap();

    const faqSectionFaqs = await getFaqs(
        capabilityBackendRepresentation.capabilityPageContent.faqSectionFaqs,
    );
    if (faqSectionFaqs instanceof Error) {
        return faqSectionFaqs;
    }

    perfTimer.lap();

    const capability: Capability = {
        id: capabilityBackendRepresentation.id,
        slug: capabilityBackendRepresentation.slug,
        humanReadableName: capabilityBackendRepresentation.humanReadableName,
        vertical: capabilityBackendRepresentation.vertical,
        // relatedCapabilities: capabilityBackendRepresentation,
        // relatedIndustries: capabilityBackendRepresentation,
        capabilityPageContent: {
            metaTitle:
                capabilityBackendRepresentation.capabilityPageContent.metaTitle,
            metaDescription:
                capabilityBackendRepresentation.capabilityPageContent
                    .metaDescription,
            structuredData:
                capabilityBackendRepresentation.capabilityPageContent
                    .structuredData,

            coverImageDesktop:
                capabilityBackendRepresentation.capabilityPageContent
                    .coverImageDesktop,
            coverImageMobile:
                capabilityBackendRepresentation.capabilityPageContent
                    .coverImageMobile,
            heroSectionH1:
                capabilityBackendRepresentation.capabilityPageContent
                    .heroSectionH1,
            heroSectionH2:
                capabilityBackendRepresentation.capabilityPageContent
                    .heroSectionH2,
            heroSectionMetrics:
                capabilityBackendRepresentation.capabilityPageContent
                    .heroSectionMetrics,

            introductionSectionH1:
                capabilityBackendRepresentation.capabilityPageContent
                    .introductionSectionH1,
            introductionSectionH2:
                capabilityBackendRepresentation.capabilityPageContent
                    .introductionSectionH2,
            introductionSectionContent:
                capabilityBackendRepresentation.capabilityPageContent
                    .introductionSectionContent,
            introductionSectionFeaturedBlog: introductionSectionFeaturedBlog,

            unlockingCapabilitySectionH1:
                capabilityBackendRepresentation.capabilityPageContent
                    .unlockingCapabilitySectionH1,
            unlockingCapabilitySectionH2:
                capabilityBackendRepresentation.capabilityPageContent
                    .unlockingCapabilitySectionH2,
            unlockingCapabilitySectionTips:
                capabilityBackendRepresentation.capabilityPageContent
                    .unlockingCapabilitySectionTips,

            randomMarqueeSectionMarquee:
                capabilityBackendRepresentation.capabilityPageContent
                    .randomMarqueeSectionMarquee,

            blogsSectionImage:
                capabilityBackendRepresentation.capabilityPageContent
                    .blogsSectionImage,
            blogsSectionBlogs: blogsSectionBlogs,

            transformingCapabilitySectionH1:
                capabilityBackendRepresentation.capabilityPageContent
                    .transformingCapabilitySectionH1,
            transformingCapabilitySectionH2:
                capabilityBackendRepresentation.capabilityPageContent
                    .transformingCapabilitySectionH2,
            transformingCapabilitySectionContent:
                capabilityBackendRepresentation.capabilityPageContent
                    .transformingCapabilitySectionContent,
            transformingCapabilitySectionCards:
                capabilityBackendRepresentation.capabilityPageContent
                    .transformingCapabilitySectionCards,

            processSectionTitle:
                capabilityBackendRepresentation.capabilityPageContent
                    .processSectionTitle,
            processSectionSteps:
                capabilityBackendRepresentation.capabilityPageContent
                    .processSectionSteps,

            whatWeThinkSectionH1:
                capabilityBackendRepresentation.capabilityPageContent
                    .whatWeThinkSectionH1,
            whatWeThinkSectionBlogs: {
                style1Blogs: whatWeThinkStyle1Blogs,
                style2Blogs: whatWeThinkStyle2Blogs,
                style3Blog: whatWeThinkStyle3Blog,
            },

            caseStudiesSectionH1:
                capabilityBackendRepresentation.capabilityPageContent
                    .caseStudiesSectionH1,
            caseStudiesSectionH2:
                capabilityBackendRepresentation.capabilityPageContent
                    .caseStudiesSectionH2,
            caseStudiesSectionCaseStudies: caseStudiesSectionCaseStudies,

            faqSectionFaqs: faqSectionFaqs,
        },
    };

    perfTimer.end();

    return capability;
}

async function getCapabilityBackendRepresentation(
    capabilitySlug: string,
): Promise<CapabilityBackendRepresentation | null | Error> {
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
                vertical,
                page_content
            FROM
                capabilities
            WHERE
                slug = $1;
        `,
        [capabilitySlug],
    );

    if (result instanceof Error) {
        return result;
    }

    if (result.rowCount == 0) {
        return null;
    }
    return rowToCapabilityBackendRepresentation(getSingletonValue(result.rows));
}

function rowToCapabilityMetadata(row: unknown): CapabilityMetadata {
    const capabilityMetadataRowValidator = zod.object({
        id: zod.string().transform((str) => getUuidFromUnknown(str)),
        slug: zod.string(),
        human_readable_name: zod.string(),
        vertical: zod.any(),
    });

    const validatedRow = capabilityMetadataRowValidator.parse(row);

    const capabilityMetadata: CapabilityMetadata = {
        id: validatedRow.id,
        slug: validatedRow.slug,
        humanReadableName: validatedRow.human_readable_name,
        vertical: validatedRow.vertical,
    };

    return capabilityMetadata;
}

function rowToCapabilityBackendRepresentation(
    row: unknown,
): CapabilityBackendRepresentation {
    const validatedRow = capabilityRowValidator.parse(row);

    const capabilityBackendRepresentation: CapabilityBackendRepresentation = {
        id: validatedRow.id,
        slug: validatedRow.slug,
        humanReadableName: validatedRow.human_readable_name,
        vertical: validatedRow.vertical,
        capabilityPageContent: validatedRow.page_content,
    };

    return capabilityBackendRepresentation;
}
