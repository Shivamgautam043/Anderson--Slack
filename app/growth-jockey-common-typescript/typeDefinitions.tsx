import type {
    BlurHash,
    Integer,
    Iso8601Date,
    Iso8601DateTime,
    Serialized,
    Uuid,
} from "~/common--type-definitions/typeDefinitions";
import type {BlogBuildingBlockType} from "~/growth-jockey-common-typescript/blogBuildingBlocks";
import type {UserAnalytics} from "~/hooks/useUserAnalytics";

export type ImageDetails = {
    width: number;
    height: number;
    blurHash?: BlurHash;
    altText?: string;
    variants: Array<{
        width: number;
        height: number;
        // format?: string;
        extension?: string;
        url: string;
    }>;
};

export type JobListing = {
    id: Uuid;
    createdAt: string;
    lastUpdatedAt: string;
    isActive: boolean;
    role: string;
    band: string;
    department: string;
    function: string;
    shortDescription: string;
    description: string;
    jobRolesAndKeyDeliverables: Array<string>;
    qualificationsAndExperience: Array<string>;
    keySkills: Array<string>;
    location: {
        city: string;
        country: string;
    };
    positionClassification: string;
    isDeleted: boolean;
    isHotHiring: boolean;
};

export type JobApplication = {
    id: Uuid;
    createdAt: string;
    userId: Uuid | null;
    jobListingId: Uuid | null;
    name: string;
    emailId: string;
    phoneNumberPrefix: string;
    phoneNumber: string;
    highestEducation: string;
    previousExperience: string;
    previousEmployer: string;
    previousDesignation: string;
    currentCtc: string;
    noticePeriod: string;
    topSkills: string;
    portfolioWebsiteUrl: string;
};

export type BlogBuildingBlock = {
    typeId: BlogBuildingBlockType;
    content: string | null;
};

export type BlogMetadata = {
    id: Uuid;
    createdAt: string;
    lastUpdatedAt: string;
    title: string;
    subtitle: string;
    coverImage: ImageDetails;
    authorId: Uuid;
    relatedVerticals: Array<string>;
    relatedCapabilities: Array<Uuid>;
    relatedIndustries: Array<Uuid>;
    slug: string;
    // TODO: Shift these to blog?
    seoTitle: string;
    seoDescription: string;
    seoImage: string;
};

export type Blog = BlogMetadata & {
    buildingBlocks: Array<BlogBuildingBlock>;
};

export const blogCoverImageWidth = 1920;
export const blogCoverImageHeight = 1435;

// export type BlogMinimalInfo1 = {
//     title: string;
//     subtitle: string;
//     slug: string;
// };

// export type BlogMinimalInfo2 = {
//     title: string;
//     subtitle: string;
//     slug: string;
//     coverImage: string;
// };

// export type BlogMinimalInfo3 = {
//     title: string;
//     slug: string;
//     relatedVerticals: Array<string>;
// };

// export type BlogMinimalInfo4 = {
//     id: Uuid;
//     title: string;
//     subtitle: string;
//     slug: string;
//     relatedVerticals: Array<string>;
// };

export type SlugStatus = "ACTIVE" | "PASSIVE";

export type Slug = {
    id: Uuid;
    slug: string;
    status: SlugStatus;
    created_at: string;
    updated_at: string;
    blog_id: Uuid;
};

export type BlogAuthor = {
    id: Uuid;
    createdAt: string;
    lastUpdatedAt: string;
    name: string;
    image: ImageDetails;
    designation: string;
    bio: string;
    twitterLink: string;
    linkedInLink: string;
};

export type TeamMember = {
    id: Uuid;
    imageId: Uuid;
    name: string;
    designation: string;
    linkedinUrl: string;
    bio: string;
};

export type BusinessVertical = "Growth" | "Operations" | "Technology";

export type CaseStudy = {
    title: string;
    imageRelativeUrl: string;
    problem: string;
    solution: string;
    metrics: Array<{
        metricValue: string;
        metric: string;
    }>;
};

export type Testimonial = {
    companyLogoRelativePath: string;
    rating: number;
    message: string;
    reviewerRelativePath: string;
    reviewerName: string;
    reviewerDesignation: string;
};

export type Faq = {
    question: string;
    answer: string;
};

export type CapabilityMetadata = {
    id: Uuid;
    slug: string;
    humanReadableName: string;
    vertical: BusinessVertical;
};

export type Capability = {
    id: string;
    slug: string;
    humanReadableName: string;
    vertical: BusinessVertical;
    // relatedCapabilities: Array<string>;
    // relatedIndustries: Array<string>;
    capabilityPageContent: {
        metaTitle: string;
        metaDescription: string;
        structuredData: any;

        coverImageDesktop: ImageDetails;
        coverImageMobile: ImageDetails;
        heroSectionH1: string;
        heroSectionH2: string;
        heroSectionMetrics: Array<{
            key: string;
            value: string;
        }>;

        introductionSectionH1: string;
        introductionSectionH2: string;
        introductionSectionContent: string;
        introductionSectionFeaturedBlog: BlogMetadata;

        unlockingCapabilitySectionH1: string;
        unlockingCapabilitySectionH2: string;
        unlockingCapabilitySectionTips: Array<{
            image: ImageDetails;
            title: string;
            content: string;
        }>;

        randomMarqueeSectionMarquee: string;

        blogsSectionImage: ImageDetails;
        blogsSectionBlogs: Array<BlogMetadata>;

        transformingCapabilitySectionH1: string;
        transformingCapabilitySectionH2: string;
        transformingCapabilitySectionContent: string;
        transformingCapabilitySectionCards: Array<{
            imageUrl: string;
            title: string;
            content: string;
        }>;

        processSectionTitle: string;
        processSectionSteps: Array<{
            shortTitle: string;
            title: string;
            content: string;
            ctaText: string;
        }>;

        whatWeThinkSectionH1: string;
        whatWeThinkSectionBlogs: {
            style1Blogs: Array<BlogMetadata>;
            style2Blogs: Array<BlogMetadata>;
            style3Blog: BlogMetadata;
        };

        caseStudiesSectionH1: string;
        caseStudiesSectionH2: string;
        caseStudiesSectionCaseStudies: Array<CaseStudy>;

        faqSectionFaqs: Array<Faq>;
    };
};

export type CapabilityBackendRepresentation = {
    id: string;
    slug: string;
    humanReadableName: string;
    vertical: BusinessVertical;
    // relatedCapabilities: Array<string>;
    // relatedIndustries: Array<string>;
    capabilityPageContent: {
        metaTitle: string;
        metaDescription: string;
        structuredData: any,

        coverImageDesktop: ImageDetails;
        coverImageMobile: ImageDetails;
        heroSectionH1: string;
        heroSectionH2: string;
        heroSectionMetrics: Array<{
            key: string;
            value: string;
        }>;

        introductionSectionH1: string;
        introductionSectionH2: string;
        introductionSectionContent: string;
        introductionSectionFeaturedBlog: Uuid;

        unlockingCapabilitySectionH1: string;
        unlockingCapabilitySectionH2: string;
        unlockingCapabilitySectionTips: Array<{
            image: ImageDetails;
            title: string;
            content: string;
        }>;

        randomMarqueeSectionMarquee: string;

        blogsSectionImage: ImageDetails;
        blogsSectionBlogs: Array<Uuid>;

        transformingCapabilitySectionH1: string;
        transformingCapabilitySectionH2: string;
        transformingCapabilitySectionContent: string;
        transformingCapabilitySectionCards: Array<{
            imageUrl: string;
            title: string;
            content: string;
        }>;

        processSectionTitle: string;
        processSectionSteps: Array<{
            shortTitle: string;
            title: string;
            content: string;
            ctaText: string;
        }>;

        whatWeThinkSectionH1: string;
        whatWeThinkSectionBlogs: {
            style1Blogs: Array<Uuid>;
            style2Blogs: Array<Uuid>;
            style3Blog: Uuid;
        };

        caseStudiesSectionH1: string;
        caseStudiesSectionH2: string;
        caseStudiesSectionCaseStudies: Array<string>;

        faqSectionFaqs: Array<string>;
    };
};

export type IndustryMetadata = {
    id: Uuid;
    slug: string;
    humanReadableName: string;
};

export type Industry = {
    id: string;
    slug: string;
    humanReadableName: string;
    // relatedIndustries: Array<string>;
    industryPageContent: {
        metaTitle: string;
        metaDescription: string;
        structuredData: any;

        coverImageDesktop: ImageDetails;
        coverImageMobile: ImageDetails;
        heroSectionH1: string;
        heroSectionH2: string;

        introductionSectionH1: string;
        introductionSectionH2: string;
        introductionSectionContent: string;
        teaserBlogs: Array<BlogMetadata>;

        numbersSectionMetrics: Array<{
            metricValue: string;
            metric: string;
        }>;

        detailedContentSectionH1: string;
        detailedContentSectionH2: string;
        detailedContentSectionContent: string;
        detailedContentSectionServices: Array<{
            image: ImageDetails;
            title: string;
            content: string;
        }>;

        superTeaserBlog: BlogMetadata;

        howGrowthJockeyCanHelpSectionH1: string;
        howGrowthJockeyCanHelpSectionH2: string;
        howGrowthJockeyCanHelpSectionContent: string;
        howGrowthJockeyCanHelpSectionCapabilities: Array<{
            title: string;
            content: string;
        }>;

        whatWeThinkBlogs: {
            style1Blogs: Array<BlogMetadata>;
            style2Blogs: Array<BlogMetadata>;
            style3Blog: BlogMetadata;
        };

        latestUpdatesBlogs: Array<BlogMetadata>;

        relatedArticleBlogs: Array<BlogMetadata>;
    };
};

export type IndustryBackendRepresentation = {
    id: string;
    slug: string;
    humanReadableName: string;
    // relatedIndustries: Array<string>;
    industryPageContent: {
        metaTitle: string;
        metaDescription: string;
        structuredData: any;

        coverImageDesktop: ImageDetails;
        coverImageMobile: ImageDetails;
        heroSectionH1: string;
        heroSectionH2: string;

        introductionSectionH1: string;
        introductionSectionH2: string;
        introductionSectionContent: string;
        teaserBlogs: Array<Uuid>;

        numbersSectionMetrics: Array<{
            metricValue: string;
            metric: string;
        }>;

        detailedContentSectionH1: string;
        detailedContentSectionH2: string;
        detailedContentSectionContent: string;
        detailedContentSectionServices: Array<{
            image: ImageDetails;
            title: string;
            content: string;
        }>;

        superTeaserBlog: Uuid;

        howGrowthJockeyCanHelpSectionH1: string;
        howGrowthJockeyCanHelpSectionH2: string;
        howGrowthJockeyCanHelpSectionContent: string;
        howGrowthJockeyCanHelpSectionCapabilities: Array<{
            title: string;
            content: string;
        }>;

        whatWeThinkBlogs: Array<Uuid>;

        latestUpdatesBlogs: Array<Uuid>;

        relatedArticleBlogs: Array<Uuid>;
    };
};

export type PressAndMediaCardData = {
    image: ImageDetails;
    title: string;
    publishedOn: Iso8601Date;
};

// TODO: Rename to NewProjectLead or something?
export type StartAProjectData = {
    id: Uuid;
    createdAt: Iso8601DateTime;
    updatedAt: Iso8601DateTime;
    userAnalytics: UserAnalytics;
    partial: boolean;
    autosave: boolean;
    step: Integer;
    name: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    companyWebsite: string;
    companySize: string;
    services: Array<string>;
    meetingDate: string;
    meetingTime: string;
    projectDetails: string;
    pageurl: string;
};

export type PartialStartAProjectData = Partial<StartAProjectData> & {id: Uuid; userAnalytics: UserAnalytics; partial: boolean; autosave: boolean; step: Integer};
export type SerializedPartialStartAProjectData = Partial<Serialized<StartAProjectData>> & {
    id: Uuid;
    userAnalytics: UserAnalytics;
    partial: "true" | "false";
    autosave: "true" | "false";
    step: Integer;
};

export type StartAProjectFields = {
    name: string;
    email: string;
    phoneNumber: string;
    services: string;
};

export type StartAProjectEntry = {
    id: Uuid;
    createdAt: Iso8601DateTime;
    updatedAt: Iso8601DateTime;
    data: StartAProjectFields;
    userAnalytics: UserAnalytics;
    autosave: boolean;
};

export type StartAProjectEntryBackendRepresentation = {
    id: Uuid;
    createdAt: Iso8601DateTime;
    updatedAt: Iso8601DateTime;
    userAnalytics: string;
    data: string;
};
