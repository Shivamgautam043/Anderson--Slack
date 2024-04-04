import {z as zod} from "zod";
import {getUuidFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";

export const uuidValidator = zod
    .string()
    .transform((str) => getUuidFromUnknown(str));

export const imageDetailsValidator = zod.object({
    width: zod.number(),
    height: zod.number(),
    blurHash: zod.string().optional(),
    altText: zod.string().optional(),
    variants: zod.array(
        zod.object({
            width: zod.number(),
            height: zod.number(),
            extension: zod.string(),
            url: zod.string(),
        }),
    ),
});

export const capabilityRowValidator = zod.object({
    id: uuidValidator,
    slug: zod.string(),
    human_readable_name: zod.string(),
    vertical: zod.union([
        zod.literal("Growth"),
        zod.literal("Operations"),
        zod.literal("Technology"),
    ]),
    page_content: zod.object({
        metaTitle: zod.string(),
        metaDescription: zod.string(),
        structuredData: zod.any(),
        coverImageDesktop: imageDetailsValidator,
        coverImageMobile: imageDetailsValidator,
        heroSectionH1: zod.string(),
        heroSectionH2: zod.string(),
        heroSectionMetrics: zod.array(
            zod.object({
                key: zod.string(),
                value: zod.string(),
            }),
        ),
        introductionSectionH1: zod.string(),
        introductionSectionH2: zod.string(),
        introductionSectionContent: zod.string(),
        introductionSectionFeaturedBlog: uuidValidator,
        unlockingCapabilitySectionH1: zod.string(),
        unlockingCapabilitySectionH2: zod.string(),
        unlockingCapabilitySectionTips: zod.array(
            zod.object({
                image: imageDetailsValidator,
                title: zod.string(),
                content: zod.string(),
            }),
        ),
        randomMarqueeSectionMarquee: zod.string(),
        blogsSectionImage: imageDetailsValidator,
        blogsSectionBlogs: zod.array(uuidValidator),
        transformingCapabilitySectionH1: zod.string(),
        transformingCapabilitySectionH2: zod.string(),
        transformingCapabilitySectionContent: zod.string(),
        transformingCapabilitySectionCards: zod.array(
            zod.object({
                imageUrl: zod.string(),
                title: zod.string(),
                content: zod.string(),
            }),
        ),
        processSectionTitle: zod.string(),
        processSectionSteps: zod.array(
            zod.object({
                shortTitle: zod.string(),
                title: zod.string(),
                content: zod.string(),
                ctaText: zod.string(),
            }),
        ),
        whatWeThinkSectionH1: zod.string(),
        whatWeThinkSectionBlogs: zod.object({
            style1Blogs: zod.array(uuidValidator),
            style2Blogs: zod.array(uuidValidator),
            style3Blog: uuidValidator,
        }),
        caseStudiesSectionH1: zod.string(),
        caseStudiesSectionH2: zod.string(),
        caseStudiesSectionCaseStudies: zod.array(zod.string()),
        faqSectionFaqs: zod.array(zod.string()),
    }),
});

export const industryRowValidator = zod.object({
    id: uuidValidator,
    slug: zod.string(),
    human_readable_name: zod.string(),
    page_content: zod.object({
        metaTitle: zod.string(),
        metaDescription: zod.string(),
        structuredData: zod.any(),
        coverImageDesktop: imageDetailsValidator,
        coverImageMobile: imageDetailsValidator,
        heroSectionH1: zod.string(),
        heroSectionH2: zod.string(),
        introductionSectionH1: zod.string(),
        introductionSectionH2: zod.string(),
        introductionSectionContent: zod.string(),
        teaserBlogs: zod.array(uuidValidator),
        numbersSectionMetrics: zod.array(
            zod.object({
                metricValue: zod.string(),
                metric: zod.string(),
            }),
        ),
        detailedContentSectionH1: zod.string(),
        detailedContentSectionH2: zod.string(),
        detailedContentSectionContent: zod.string(),
        detailedContentSectionServices: zod.array(
            zod.object({
                image: imageDetailsValidator,
                title: zod.string(),
                content: zod.string(),
            }),
        ),
        superTeaserBlog: uuidValidator,
        howGrowthJockeyCanHelpSectionH1: zod.string(),
        howGrowthJockeyCanHelpSectionH2: zod.string(),
        howGrowthJockeyCanHelpSectionContent: zod.string(),
        howGrowthJockeyCanHelpSectionCapabilities: zod.array(
            zod.object({
                title: zod.string(),
                content: zod.string(),
            }),
        ),
        whatWeThinkBlogs: zod.array(uuidValidator),
        latestUpdatesBlogs: zod.array(uuidValidator),
        relatedArticleBlogs: zod.array(uuidValidator),
    }),
});
