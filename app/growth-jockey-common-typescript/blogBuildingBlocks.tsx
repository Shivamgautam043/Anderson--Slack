import {Linkedin, Twitter} from "react-bootstrap-icons";
import type {Uuid} from "~/common--type-definitions/typeDefinitions";
import type {Blog, BlogAuthor, BlogBuildingBlock} from "~/growth-jockey-common-typescript/typeDefinitions";
import ReactMarkdown from "react-markdown";
import {reactMarkdownComponents} from "~/growth-jockey-common-typescript/scratchpad";
import remarkBreaks from "remark-breaks";
import {InvalidEnumValueError} from "~/global-common-typescript/errors/invalidEnumValueError";
import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

export enum BlogBuildingBlockType {
    text = "d2506c66-6140-4c77-8792-35b3a61b9a24",
    markdown = "a44f8bba-0338-4875-817a-98f0aa190885",
    fullWidthImage = "552a96dc-5c95-49fd-9bff-ae4d6e86b15e",
    aboutTheAuthor = "0e9e2f69-4382-41af-b7b2-2fa1f305afe5",
    verticalSpacer = "a69b2cc8-673f-4d19-a836-671fd5bd7a9f",
    randomRelatedBlogs = "1e4f769e-27b9-49ff-90b4-8c09e9e228f2",
}

export const blogBuildingBlockTemplates = [
    {
        id: "d2506c66-6140-4c77-8792-35b3a61b9a24",
        humanReadableString: "Text",
    },
    {
        id: "a44f8bba-0338-4875-817a-98f0aa190885",
        humanReadableString: "Markdown",
    },
    {
        id: "552a96dc-5c95-49fd-9bff-ae4d6e86b15e",
        humanReadableString: "Full Width Image",
    },
    {
        id: "0e9e2f69-4382-41af-b7b2-2fa1f305afe5",
        humanReadableString: "About the Author",
    },
    {
        id: "a69b2cc8-673f-4d19-a836-671fd5bd7a9f",
        humanReadableString: "Vertical Spacer",
    },
    {
        id: "1e4f769e-27b9-49ff-90b4-8c09e9e228f2",
        humanReadableString: "Random Related Blogs",
    },
];

export function blogBuildingBlockTypeToHumanReadableString(blogBuildingBlockType: Uuid): string {
    return blogBuildingBlockTemplates.filter((blogBuildingBlockTemplate) => blogBuildingBlockTemplate.id == blogBuildingBlockType)[0].humanReadableString;
}

export function BlogBuildingBlockComponent({blog, blogAuthor, buildingBlock}: {blog: Blog; blogAuthor: BlogAuthor; buildingBlock: BlogBuildingBlock}) {
    switch (buildingBlock.typeId) {
        case BlogBuildingBlockType.text: {
            return <div>{buildingBlock.content}</div>;
        }
        case BlogBuildingBlockType.markdown: {
            return (
                <ReactMarkdown
                    components={reactMarkdownComponents}
                    remarkPlugins={[remarkBreaks]}
                >
                    {buildingBlock.content!}
                    {/* {transformTextForReactMarkdown(buildingBlock.content)!} */}
                </ReactMarkdown>
            );
        }
        case BlogBuildingBlockType.fullWidthImage: {
            return (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                    src={buildingBlock.content!}
                    className="tw-w-full"
                />
            );
        }
        case BlogBuildingBlockType.aboutTheAuthor: {
            return <AboutTheAuthor blogAuthor={blogAuthor} />;
        }
        case BlogBuildingBlockType.verticalSpacer: {
            return <div style={{height: buildingBlock.content!}} />;
        }
        case BlogBuildingBlockType.randomRelatedBlogs: {
            return <RandomRecommendedBlogPosts />;
        }
        default: {
            throw InvalidEnumValueError(`Invalid value ${buildingBlock.typeId} received for enum BlogBuildingBlockType`);
        }
    }
}

export function AboutTheAuthor({blogAuthor, className}: {blogAuthor: BlogAuthor; className?: string}) {
    return (
        <div
            className={concatenateNonNullStringsWithSpaces(
                "tw-w-full tw-p-8 gjo-bg-foreground-100 tw-rounded-lg tw-relative tw-grid tw-grid-cols-[12rem_minmax(0,1fr)] tw-grid-rows-[4rem_auto_auto] tw-gap-x-4 tw-gap-y-4",
                className,
            )}
        >
            <div className="tw-absolute tw-left-8 -tw-top-24">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img
                    src={blogAuthor.image.variants[0].url}
                    className="tw-w-48 tw-rounded-full tw-outline tw-outline-8 tw-outline-background-500-light dark:tw-outline-background-500-dark"
                />
            </div>

            <div className="tw-row-start-1 tw-col-start-2 tw-flex tw-flex-col">
                <div className="tw-font-body+2">{blogAuthor.name}</div>
                <div className="tw-font-body+1">{blogAuthor.designation}</div>
            </div>

            <div className="tw-row-start-2 tw-col-start-1 tw-col-span-2">{blogAuthor.bio}</div>

            <div className="tw-row-start-3 tw-col-start-1 tw-col-span-2 tw-flex tw-flex-row tw-justify-between">
                <div className="gjo-text-body-bold">Follow On:</div>

                <div className="tw-flex tw-flex-row tw-gap-x-4">
                    <a href={blogAuthor.twitterLink}>
                        <Twitter className="tw-w-6 tw-h-6 gjo-text-primary-500" />
                    </a>

                    <a href={blogAuthor.linkedInLink}>
                        <Linkedin className="tw-w-6 tw-h-6  gjo-text-primary-500" />
                    </a>
                </div>
            </div>
        </div>
    );
}

function RandomRecommendedBlogPosts({className}: {className?: string}) {
    return (
        <div className={concatenateNonNullStringsWithSpaces("tw-w-full tw-grid tw-grid-cols-1 lg:tw-grid-cols-[20rem_minmax(0,1fr)] tw-gap-x-8 tw-gap-y-8", className)}>
            <div className="tw-row-start-1 lg:tw-row-start-1 lg:tw-col-start-1 lg:tw-col-span-2 tw-h-2 tw-border tw-border-primary" />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
                src="https://images.growthjockey.com/growth-jockey/blogs/77eba30c-3c86-4801-b475-351ab073e162/1.png"
                className="tw-row-start-2 lg:tw-row-start-2 lg:tw-col-start-1 tw-w-full"
            />
            <div className="tw-row-start-3 lg:tw-row-start-2 lg:tw-col-start-2 lg:tw-col-span-2 tw-flex tw-flex-col">
                <div className="gjo-text-heading gjo-text-primary-gradient">These might interest you</div>
                <div className="gjo-text-heading=light">Bootstrapping a Business</div>
            </div>
            <div className="tw-row-start-4 lg:tw-row-start-3 lg:tw-col-start-1 lg:tw-col-span-2 tw-h-2 tw-border tw-border-primary-500" />
        </div>
    );
}
