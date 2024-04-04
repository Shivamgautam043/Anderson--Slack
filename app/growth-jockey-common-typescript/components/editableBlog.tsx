import {MultiSelect, Select, TextInput} from "@mantine/core";
import {useReducer, useRef} from "react";
import {XCircleFill} from "react-bootstrap-icons";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import type {Uuid} from "~/common--type-definitions/typeDefinitions";
import {
    EditableTextArea,
    EditableTextField,
    GrowthJockeySearchableDropdownMultiple,
} from "~/components/scratchpad";
import {ItemBuilder} from "~/global-common-typescript/components/itemBuilder";
import {VerticalSpacer} from "~/global-common-typescript/components/verticalSpacer";
import {InvalidEnumValueError} from "~/global-common-typescript/errors/invalidEnumValueError";
import {
    getNonEmptyStringFromUnknown,
    safeParse,
} from "~/global-common-typescript/utilities/typeValidationUtilities";
import {
    concatenateNonNullStringsWithSpaces,
    getSingletonValue,
} from "~/global-common-typescript/utilities/utilities";
import {
    BlogBuildingBlockComponent,
    BlogBuildingBlockType,
    blogBuildingBlockTemplates,
} from "~/growth-jockey-common-typescript/blogBuildingBlocks";
import {reactMarkdownComponents} from "~/growth-jockey-common-typescript/scratchpad";
import type {
    Blog,
    BlogAuthor,
    BlogBuildingBlock,
    CapabilityMetadata,
    ImageDetails,
    IndustryMetadata,
} from "~/growth-jockey-common-typescript/typeDefinitions";
import {
    blogCoverImageHeight,
    blogCoverImageWidth,
} from "~/growth-jockey-common-typescript/typeDefinitions";
import {getCapabilityFromId, getIndustryFromId} from "~/utilities/utilities";

export type BlogForEditableBlogState = Omit<Blog, "coverImage"> & {
    coverImage: ImageDetails | null;
};

export type EditableBlogState = {
    originalBlog: BlogForEditableBlogState;
    currentBlog: BlogForEditableBlogState;
    updatedCoverImageFile: File | null;
    updatedCoverImageUrl: string | null;
};

export type EditableBlogReducerAction =
    | {
          type: EditableBlogReducerActionType.addBuildingBlock;
          details: {
              row: number;
              type: BlogBuildingBlockType;
          };
      }
    | {
          type: EditableBlogReducerActionType.changeAuthor;
          details: {
              authorId: Uuid;
          };
      }
    | {
          type: EditableBlogReducerActionType.changeBuildingBlockType;
          details: {
              buildingBlock: BlogBuildingBlock;
              value: BlogBuildingBlockType;
          };
      }
    | {
          type: EditableBlogReducerActionType.changeCoverImage;
          details: {
              file: File | null;
          };
      }
    | {
          type: EditableBlogReducerActionType.deleteBuildingBlock;
          details: {
              row: number;
          };
      }
    | {
          type: EditableBlogReducerActionType.forceRefresh;
      }
    | {
          type: EditableBlogReducerActionType.setTemplate;
          details: {
              buildingBlocks: Array<BlogBuildingBlock>;
          };
      };

// {
//     type: EditableBlogReducerActionType;
//     details: any;
// };

export enum EditableBlogReducerActionType {
    changeAuthor,
    changeBuildingBlockType,
    setTemplate,
    // moveUp,
    // moveDown,
    addBuildingBlock,
    deleteBuildingBlock,
    changeCoverImage,
    forceRefresh,
}

export const editableBlogTemplate1BuildingBlocks: Array<BlogBuildingBlock> = [
    {
        typeId: BlogBuildingBlockType.markdown,
        content: null,
    },
];

export const editableBlogTemplate2BuildingBlocks: Array<BlogBuildingBlock> = [
    {
        typeId: BlogBuildingBlockType.markdown,
        content: null,
    },
    {
        typeId: BlogBuildingBlockType.fullWidthImage,
        content: null,
    },
    {
        typeId: BlogBuildingBlockType.markdown,
        content: null,
    },
];

export const editableBlogTemplate3BuildingBlocks: Array<BlogBuildingBlock> = [
    {
        typeId: BlogBuildingBlockType.markdown,
        content: null,
    },
    {
        typeId: BlogBuildingBlockType.fullWidthImage,
        content: null,
    },
    {
        typeId: BlogBuildingBlockType.aboutTheAuthor,
        content: null,
    },
];

export const editableBlogTemplate4BuildingBlocks: Array<BlogBuildingBlock> = [
    {
        typeId: BlogBuildingBlockType.markdown,
        content: null,
    },
    {
        typeId: BlogBuildingBlockType.fullWidthImage,
        content: null,
    },
    {
        typeId: BlogBuildingBlockType.randomRelatedBlogs,
        content: null,
    },
];

export function EditableBlog({
    editableBlogState,
    blogAuthors,
    dispatch,
    className,
    isNewBlog,
    industries,
    capabilities,
}: {
    editableBlogState: EditableBlogState;
    blogAuthors: Array<BlogAuthor>;
    dispatch: React.Dispatch<EditableBlogReducerAction>;
    className?: string;
    isNewBlog: boolean;
    industries: Array<IndustryMetadata>;
    capabilities: Array<CapabilityMetadata>;
}) {
    return (
        <>
            <div
                className={concatenateNonNullStringsWithSpaces(
                    "tw-flex tw-flex-col",
                    className,
                )}
            >
                <TextInput
                    label="ID"
                    disabled={true}
                    value={editableBlogState.currentBlog.id}
                />

                <VerticalSpacer />

                <TextInput
                    label="Title"
                    value={editableBlogState.currentBlog.title}
                    onChange={(e) => {
                        editableBlogState.currentBlog.title = e.target.value;
                        // TODO: Replace the final replace calls with a regex replace
                        editableBlogState.currentBlog.slug =
                            editableBlogState.currentBlog.title
                                .toLowerCase()
                                .replaceAll("-", "")
                                .replaceAll("?", "")
                                .replaceAll("%", "")
                                .replaceAll("!", "")
                                .replaceAll(".", "")
                                .replaceAll("&", "and")
                                .replaceAll(" ", "-")
                                .replaceAll("--", "-")
                                .replaceAll("--", "-")
                                .replaceAll("--", "-")
                                .replaceAll("--", "-")
                                .replaceAll("--", "-")
                                .trim();
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                />

                <VerticalSpacer />

                <TextInput
                    label="Subtitle"
                    value={editableBlogState.currentBlog.subtitle}
                    onChange={(e) => {
                        editableBlogState.currentBlog.subtitle = e.target.value;
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                />

                <VerticalSpacer />

                {/* <Select
                    label="Author"
                    value={editableBlogState.currentBlog.authorId}
                    onChange={() => {

                    }}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select> */}

                <Select
                    label="Author"
                    placeholder="Select Author"
                    data={blogAuthors.map((blogAuthor) => ({
                        label: blogAuthor.name,
                        value: blogAuthor.id,
                    }))}
                    defaultValue={editableBlogState.currentBlog.authorId}
                    onChange={(newValue) => {
                        // if (newValue == null) {
                        //     editableBlogState.currentBlog.authorId = null;
                        // } else {
                        //     editableBlogState.currentBlog.authorId = newValue as Uuid;
                        // }

                        editableBlogState.currentBlog.authorId =
                            newValue as Uuid;

                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                />

                <VerticalSpacer />

                <MultiSelect
                    label="Verticals"
                    placeholder="Select Verticals"
                    data={["Growth", "Operations", "Technology"]}
                    defaultValue={
                        editableBlogState.currentBlog.relatedVerticals
                    }
                    onChange={(newValues) => {
                        editableBlogState.currentBlog.relatedVerticals =
                            newValues ?? [];
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                />

                <VerticalSpacer />

                <GrowthJockeySearchableDropdownMultiple
                    label="Industries"
                    items={industries}
                    selectedItems={editableBlogState.currentBlog.relatedIndustries.map(
                        (industryId) =>
                            getIndustryFromId(industryId, industries),
                    )}
                    setSelectedItems={(items) => {
                        editableBlogState.currentBlog.relatedIndustries =
                            items.map((industry) => industry.id as Uuid);
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                    renderFunction={(item) => item.humanReadableName}
                />

                <VerticalSpacer />

                <GrowthJockeySearchableDropdownMultiple
                    label="Capabilities"
                    items={capabilities}
                    selectedItems={editableBlogState.currentBlog.relatedCapabilities.map(
                        (capabilityId) =>
                            getCapabilityFromId(capabilityId, capabilities),
                    )}
                    setSelectedItems={(items) => {
                        editableBlogState.currentBlog.relatedCapabilities =
                            items.map((capability) => capability.id as Uuid);
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                    renderFunction={(item) => item.humanReadableName}
                />

                <VerticalSpacer />

                <TextInput
                    label="Slug"
                    value={editableBlogState.currentBlog.slug}
                    onChange={(e) => {
                        editableBlogState.currentBlog.slug = e.target.value;
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                />

                <VerticalSpacer />

                <TextInput
                    label="SEO/Title"
                    value={editableBlogState.currentBlog.seoTitle}
                    onChange={(e) => {
                        editableBlogState.currentBlog.seoTitle = e.target.value;
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                />

                <VerticalSpacer />

                <TextInput
                    label="SEO/Description"
                    value={editableBlogState.currentBlog.seoDescription}
                    onChange={(e) => {
                        editableBlogState.currentBlog.seoDescription =
                            e.target.value;
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                />

                {/* <VerticalSpacer />

                <TextInput
                    label="SEO/Image"
                    value={editableBlogState.currentBlog.seoImage}
                    onChange={(e) => {
                        editableBlogState.currentBlog.seoImage = e.target.value;
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                /> */}

                {/* <VerticalSpacer />

                <label className="tw-font-body+2">Layouts</label>
                <div className="tw-flex tw-flex-row tw-items-center tw-gap-x-8">
                    <button
                        type="button"
                        onClick={() => {
                            dispatch({
                                type: EditableBlogReducerActionType.setTemplate,
                                details: {
                                    buildingBlocks: editableBlogTemplate1BuildingBlocks,
                                },
                            });
                        }}
                    >
                        <LayoutSidebarReverse className="tw-w-8 tw-h-8 tw-text-fg" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            dispatch({
                                type: EditableBlogReducerActionType.setTemplate,
                                details: {
                                    buildingBlocks: editableBlogTemplate2BuildingBlocks,
                                },
                            });
                        }}
                    >
                        <LayoutSplit className="tw-w-8 tw-h-8 tw-text-fg" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            dispatch({
                                type: EditableBlogReducerActionType.setTemplate,
                                details: {
                                    buildingBlocks: editableBlogTemplate3BuildingBlocks,
                                },
                            });
                        }}
                    >
                        <LayoutSidebar className="tw-w-8 tw-h-8 tw-text-fg" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            dispatch({
                                type: EditableBlogReducerActionType.setTemplate,
                                details: {
                                    buildingBlocks: editableBlogTemplate4BuildingBlocks,
                                },
                            });
                        }}
                    >
                        <LayoutThreeColumns className="tw-w-8 tw-h-8 tw-text-fg" />
                    </button>
                </div> */}

                <BlogBuildingBlocksEditor
                    editableBlogState={editableBlogState}
                    blogAuthors={blogAuthors}
                    dispatch={dispatch}
                />
            </div>
        </>
    );
}

function BlogBuildingBlocksEditor({
    editableBlogState,
    blogAuthors,
    dispatch,
    className,
}: {
    editableBlogState: EditableBlogState;
    blogAuthors: Array<BlogAuthor>;
    dispatch: React.Dispatch<EditableBlogReducerAction>;
    className?: string;
}) {
    return (
        <div
            className={concatenateNonNullStringsWithSpaces(
                "gjo-bg-foreground-100 tw-p-4 tw-rounded-lg tw-overflow-x-hidden tw-flex tw-flex-col tw-gap-y-6",
                className,
            )}
        >
            <BlogCoverImage
                editableBlogState={editableBlogState}
                dispatch={dispatch}
            />

            <div className="tw-w-full tw-grid tw-cols-1 tw-gap-y-6">
                <ItemBuilder
                    items={editableBlogState.currentBlog.buildingBlocks}
                    itemBuilder={(buildingBlock, buildingBlockIndex) => (
                        <EditableBlogBuildingBlockComponent
                            blog={editableBlogState.currentBlog}
                            blogAuthors={blogAuthors}
                            buildingBlock={buildingBlock}
                            dispatch={dispatch}
                            key={buildingBlockIndex}
                        />
                    )}
                />
            </div>

            {/* <button
                type="button"
                className="tw-place-self-center"
                onClick={() => {
                    dispatch({
                        type: EditableBlogReducerActionType.addBuildingBlock,
                        details: {
                            row: editableBlogState.currentBlog.buildingBlocks.length,
                            type: BlogBuildingBlockType.randomRelatedBlogs,
                        },
                    });
                }}
            >
                <PlusCircleFill className="tw-w-8 tw-h-8 tw-text-green-500" />
            </button> */}
        </div>
    );
}

function BlogCoverImage({
    editableBlogState,
    dispatch,
}: {
    editableBlogState: EditableBlogState;
    dispatch: React.Dispatch<EditableBlogReducerAction>;
}) {
    return (
        <div className="tw-w-full tw-aspect-video tw-relative">
            {editableBlogState.updatedCoverImageUrl != null ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                    src={editableBlogState.updatedCoverImageUrl}
                    width={blogCoverImageWidth}
                    height={blogCoverImageHeight}
                    className="tw-w-full tw-h-full tw-rounded-lg tw-object-cover"
                />
            ) : editableBlogState.currentBlog.coverImage != null ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                    src={
                        editableBlogState.currentBlog.coverImage.variants[0].url
                    }
                    width={editableBlogState.currentBlog.coverImage.width}
                    height={editableBlogState.currentBlog.coverImage.height}
                    className="tw-w-full tw-h-full tw-rounded-lg tw-object-cover"
                />
            ) : (
                <div
                    className={`tw-w-full tw-h-full tw-rounded-lg tw-object-cover tw-aspect-[${blogCoverImageWidth}/${blogCoverImageHeight}]`}
                />
            )}

            <div
                className="tw-absolute tw-inset-0 tw-grid tw-place-items-center"
                onClick={() => document.getElementById("coverImage")?.click()}
            >
                <div className="tw-p-2 tw-bg-[#00000099] tw-rounded-lg">
                    Click to upload image
                </div>
            </div>
        </div>
    );
}

function EditableBlogBuildingBlockComponent({
    blog,
    blogAuthors,
    buildingBlock,
    dispatch,
}: {
    blog: BlogForEditableBlogState;
    blogAuthors: Array<BlogAuthor>;
    buildingBlock: BlogBuildingBlock;
    dispatch: React.Dispatch<EditableBlogReducerAction>;
}) {
    enum ComponentActionType {
        mouseEnter,
        mouseLeave,
    }
    type ComponentState = {[elementId: string]: boolean};
    type ComponentAction = {type: ComponentActionType; elementId: string};
    const componentReducer: (
        oldState: ComponentState,
        action: ComponentAction,
    ) => ComponentState = (
        oldState: ComponentState,
        action: ComponentAction,
    ) => {
        switch (action.type) {
            case ComponentActionType.mouseEnter: {
                return {
                    ...oldState,
                    [action.elementId]: true,
                };
            }
            case ComponentActionType.mouseLeave: {
                return {
                    ...oldState,
                    [action.elementId]: false,
                };
            }
            default: {
                throw InvalidEnumValueError(
                    `Invalid value ${action} received for enum ComponentActionType`,
                );
            }
        }
    };
    const [componentState, componentDispatch] = useReducer(
        componentReducer,
        {},
    );

    const blogAuthor = getSingletonValue(
        blogAuthors.filter((blogAuthor) => blogAuthor.id == blog.authorId),
    );

    return (
        <div
            className="tw-relative tw-group hover:tw-outline-dashed hover:tw-outline-1 hover:tw-outline-primary-1 hover:tw-outline-offset-8"
            onMouseEnter={() =>
                componentDispatch({
                    type: ComponentActionType.mouseEnter,
                    elementId: "main",
                })
            }
            onMouseLeave={() =>
                componentDispatch({
                    type: ComponentActionType.mouseLeave,
                    elementId: "main",
                })
            }
        >
            <div
                className={concatenateNonNullStringsWithSpaces(
                    "tw-absolute tw-bottom-full tw-left-0 tw-right-0 tw-bg-bg+1 tw-bg-opacity-75 tw-grid-cols-[auto_1fr_auto_1fr_auto] tw-justify-start tw-gap-x-4 tw-gap-y-4 tw-z-10",
                    Object.values(componentState).some((value) => value == true)
                        ? "tw-grid"
                        : "tw-hidden",
                )}
                onMouseEnter={() =>
                    componentDispatch({
                        type: ComponentActionType.mouseEnter,
                        elementId: "popup",
                    })
                }
                onMouseLeave={() =>
                    componentDispatch({
                        type: ComponentActionType.mouseLeave,
                        elementId: "popup",
                    })
                }
            >
                <select
                    className="tw-col-start-1 gj-text-select tw-py-0"
                    defaultValue={
                        buildingBlock.typeId == null ? "" : buildingBlock.typeId
                    }
                    onChange={(e) => {
                        const newValue = e.target.value;
                        dispatch({
                            type: EditableBlogReducerActionType.changeBuildingBlockType,
                            details: {
                                buildingBlock: buildingBlock,
                                value: safeParse(
                                    getNonEmptyStringFromUnknown,
                                    newValue.trim(),
                                ),
                            },
                        });
                    }}
                >
                    {blogBuildingBlockTemplates.map(
                        (
                            blogBuildingBlockTemplate,
                            blogBuildingBlockTemplateIndex,
                        ) => (
                            <option
                                value={blogBuildingBlockTemplate.id}
                                key={blogBuildingBlockTemplateIndex}
                            >
                                {blogBuildingBlockTemplate.humanReadableString}
                            </option>
                        ),
                    )}
                </select>

                {/* <button
                    type="button"
                    className="tw-row-start-1 tw-col-start-2 tw-place-self-center tw-bg-bg+1 tw-p-2 tw-rounded-full"
                    onClick={() => {
                        // dispatch({
                        // });
                    }}
                    title="Extend Up"
                >
                    <ArrowBarUp className="tw-w-4 tw-h-4" />
                </button>

                <button
                    type="button"
                    className="tw-row-start-2 tw-col-start-3 tw-place-self-center tw-bg-bg+1 tw-p-2 tw-rounded-full"
                    onClick={() => {
                        dispatch({
                            type: EditableBlogReducerActionType.extendRight,
                            details: {
                                buildingBlock: buildingBlock,
                            },
                        });
                    }}
                    title="Extend Right"
                >
                    <ArrowBarRight className="tw-w-4 tw-h-4" />
                </button>

                <button
                    type="button"
                    className="tw-row-start-3 tw-col-start-2 tw-place-self-center tw-bg-bg+1 tw-p-2 tw-rounded-full"
                    onClick={() => {
                        // dispatch({
                        // });
                    }}
                    title="Extend Down"
                >
                    <ArrowBarDown className="tw-w-4 tw-h-4" />
                </button>

                <button
                    type="button"
                    className="tw-row-start-2 tw-col-start-1 tw-place-self-center tw-bg-bg+1 tw-p-2 tw-rounded-full"
                    onClick={() => {
                        // dispatch({
                        // });
                    }}
                    title="Extend Left"
                >
                    <ArrowBarLeft className="tw-w-4 tw-h-4" />
                </button> */}

                <button
                    type="button"
                    className="tw-col-start-5 tw-place-self-center tw-bg-bg+1 tw-rounded-full"
                    onClick={() => {
                        dispatch({
                            type: EditableBlogReducerActionType.deleteBuildingBlock,
                            details: {
                                row: blog.buildingBlocks.findIndex(
                                    (buildingBlock_) =>
                                        buildingBlock_ == buildingBlock,
                                ),
                            },
                        });
                    }}
                    title="Remove Block"
                >
                    <XCircleFill className="tw-w-6 tw-h-6 tw-text-red-400" />
                </button>
            </div>

            <EditableBlogBuildingBlockComponentInner
                blog={blog}
                blogAuthor={blogAuthor}
                buildingBlock={buildingBlock}
                dispatch={dispatch}
            />
        </div>
    );
}

export function EditableBlogBuildingBlockComponentInner({
    blog,
    blogAuthor,
    buildingBlock,
    dispatch,
}: {
    blog: BlogForEditableBlogState;
    blogAuthor: BlogAuthor;
    buildingBlock: BlogBuildingBlock;
    dispatch: React.Dispatch<EditableBlogReducerAction>;
}) {
    switch (buildingBlock.typeId) {
        case BlogBuildingBlockType.text: {
            return (
                <EditableTextArea
                    object={buildingBlock}
                    property="content"
                    onChangeCallback={() =>
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        })
                    }
                    placeholder="Enter text"
                />
            );
        }
        case BlogBuildingBlockType.markdown: {
            return (
                <GrowthJockeyMarkdownEditor
                    buildingBlock={buildingBlock}
                    dispatch={dispatch}
                />
            );
        }
        case BlogBuildingBlockType.fullWidthImage: {
            return (
                <div>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img
                        src={buildingBlock.content!}
                        className="tw-w-full"
                    />
                    <EditableTextField
                        object={buildingBlock}
                        property="content"
                        onChangeCallback={() =>
                            dispatch({
                                type: EditableBlogReducerActionType.forceRefresh,
                            })
                        }
                        placeholder="Enter image url"
                        className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-black tw-opacity-50"
                    />
                </div>
            );
        }
        case BlogBuildingBlockType.aboutTheAuthor: {
            return (
                <BlogBuildingBlockComponent
                    blog={blog}
                    blogAuthor={blogAuthor}
                    buildingBlock={buildingBlock}
                />
            );
        }
        case BlogBuildingBlockType.verticalSpacer: {
            return (
                <BlogBuildingBlockComponent
                    blog={blog}
                    blogAuthor={blogAuthor}
                    buildingBlock={buildingBlock}
                />
            );
        }
        case BlogBuildingBlockType.randomRelatedBlogs: {
            return (
                <BlogBuildingBlockComponent
                    blog={blog}
                    blogAuthor={blogAuthor}
                    buildingBlock={buildingBlock}
                />
            );
        }
        default: {
            throw InvalidEnumValueError(
                `Invalid value ${buildingBlock.typeId} received for enum BlogBuildingBlockType`,
            );
        }
    }
}

function GrowthJockeyMarkdownEditor({
    buildingBlock,
    dispatch,
}: {
    buildingBlock: BlogBuildingBlock;
    dispatch: React.Dispatch<EditableBlogReducerAction>;
}) {
    const leftPane = useRef<HTMLDivElement>(null);
    const rightPane = useRef<HTMLDivElement>(null);

    return (
        <div className="tw-grid tw-grid-cols-2 tw-gap-x-4 tw-h-[calc(100vh-var(--gj-header-height)-4rem)] tw-overflow-hidden">
            <div
                className="tw-h-full tw-overflow-y-hidden"
                // @ts-ignore
                onScroll={(e) =>
                    (rightPane.current.scrollTop = e.target.scrollTop)
                }
                ref={leftPane}
            >
                <textarea
                    value={buildingBlock.content ?? ""}
                    onChange={(e) => {
                        buildingBlock.content = e.target.value;
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                        });
                    }}
                    className="tw-w-full tw-h-full gj-textarea-editable"
                    placeholder="_Enter markdown here_"
                />
                {/* <MarkdownEditor
                    value={buildingBlock.content ?? ""}
                    onChange={(newValue) => {
                        buildingBlock.content = newValue;
                        dispatch({
                            type: EditableBlogReducerActionType.forceRefresh,
                            details: null,
                        });
                    }}
                    className="blog"
                /> */}
            </div>

            <div
                className="tw-h-full tw-overflow-y-auto"
                ref={rightPane}
            >
                <ReactMarkdown
                    components={reactMarkdownComponents}
                    remarkPlugins={[remarkBreaks]}
                >
                    {buildingBlock.content!}
                    {/* {transformTextForReactMarkdown(buildingBlock.content)!} */}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export function editableBlogReducer(
    oldState: EditableBlogState,
    action: EditableBlogReducerAction,
): EditableBlogState {
    const state = {...oldState};
    switch (action.type) {
        case EditableBlogReducerActionType.changeBuildingBlockType: {
            const buildingBlock = action.details.buildingBlock;

            // TODO: Do this without mutating old object
            // const buildingBlockIndex = blog.buildingBlocks.indexOf(action.details.buildingBlock);
            // updatedBlog.buildingBlocks[buildingBlockIndex].typeId = action.details.value;
            buildingBlock.typeId = action.details.value;

            break;
        }
        case EditableBlogReducerActionType.changeAuthor: {
            const authorId = action.details.authorId;

            state.currentBlog.authorId = authorId;

            break;
        }
        case EditableBlogReducerActionType.setTemplate: {
            state.currentBlog.buildingBlocks = action.details.buildingBlocks;

            break;
        }
        // case EditableBlogReducerActionType.extendUp: {
        //     // TODO: Do this without mutating old object
        //     // TODO: Add proper validations here
        //     // action.details.buildingBlock.gridPosition[64].columnStart -= 1;
        //     // action.details.buildingBlock.gridPosition[64].columnSpan += 1;

        //     state.blogMetadata.emptySections = calculateEmptySections(state);

        //     break;
        // }
        // case EditableBlogReducerActionType.extendRight: {
        //     // TODO: Do this without mutating old object
        //     // TODO: Add proper validations here
        //     // console.log(action.details.buildingBlock);
        //     // action.details.buildingBlock.gridPosition[64].columnSpan += 1;

        //     state.blogMetadata.emptySections = calculateEmptySections(state);

        //     break;
        // }
        // case EditableBlogReducerActionType.extendDown: {
        //     // TODO: Do this without mutating old object
        //     // TODO: Add proper validations here
        //     // action.details.buildingBlock.gridPosition[64].rowSpan += 1;

        //     state.blogMetadata.emptySections = calculateEmptySections(state);

        //     break;
        // }
        // case EditableBlogReducerActionType.extendLeft: {
        //     // TODO: Do this without mutating old object
        //     // TODO: Add proper validations here
        //     // action.details.buildingBlock.gridPosition[64].columnStart -= 1;
        //     // action.details.buildingBlock.gridPosition[64].columnSpan += 1;

        //     state.blogMetadata.emptySections = calculateEmptySections(state);

        //     break;
        // }
        case EditableBlogReducerActionType.addBuildingBlock: {
            const row = action.details.row;
            const type = action.details.type;

            const buildingBlock: BlogBuildingBlock = {
                typeId: type,
                content: "",
            };

            state.currentBlog.buildingBlocks = [
                ...state.currentBlog.buildingBlocks,
            ];
            state.currentBlog.buildingBlocks.splice(row, 0, buildingBlock);

            break;
        }
        case EditableBlogReducerActionType.deleteBuildingBlock: {
            const row = action.details.row;

            state.currentBlog.buildingBlocks = [
                ...state.currentBlog.buildingBlocks,
            ];
            state.currentBlog.buildingBlocks.splice(row, 1);

            break;
        }
        case EditableBlogReducerActionType.changeCoverImage: {
            const file = action.details.file;

            if (state.updatedCoverImageUrl != null) {
                URL.revokeObjectURL(state.updatedCoverImageUrl);
            }

            // file can be null if user cancels the select dialog
            if (file != null) {
                state.updatedCoverImageFile = file;
                state.updatedCoverImageUrl = URL.createObjectURL(file);
            }

            break;
        }
        case EditableBlogReducerActionType.forceRefresh: {
            break;
        }
        default: {
            throw InvalidEnumValueError(
                `Invalid value ${action} received for enum EditableBlogReducerActionType`,
            );
        }
    }

    return state;
}
