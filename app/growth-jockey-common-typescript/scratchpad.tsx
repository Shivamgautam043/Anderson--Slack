export const reactMarkdownComponents = {
    // Asset link 4aca789a-7888-47a6-ba6e-66fc51118366
    h1: ({node, ...props}) => <h1 className="tw-text-[2.25rem] tw-font-[700] tw-mt-6 tw-mb-4 tw-leading-[1.5]" {...props} />,
    // /Asset link
    // Asset link 6b4d9403-34f6-4739-b6aa-0237909b5463
    h2: ({node, ...props}) => <h2 className="tw-text-[2rem] tw-font-[700] tw-mt-6 tw-mb-4 tw-leading-[1.5]" {...props} />,
    // /Asset link
    h3: ({node, ...props}) => <h3 className="tw-text-[1.8125rem] tw-font-[700] tw-mt-6 tw-mb-4 tw-leading-[1.5]" {...props} />,
    h4: ({node, ...props}) => <h4 className="tw-text-[1.625rem] tw-font-[700] tw-mt-6 tw-mb-4 tw-leading-[1.5]" {...props} />,
    h5: ({node, ...props}) => <h5 className="tw-text-[1.4375rem] tw-font-[600] tw-mt-6 tw-mb-4 tw-leading-[1.5]" {...props} />,
    h6: ({node, ...props}) => <h6 className="tw-text-[1.25rem] tw-font-[600] tw-mt-6 tw-mb-4 tw-leading-[1.5]" {...props} />,
    p: ({node, ...props}) => <p className="tw-text-[1.125rem] tw-font-[400] tw-mt-4 tw-mb-4 tw-leading-[1.5]" {...props} />,
    // TODO: Do this
    blockquote: ({node, ...props}) => <blockquote style={{borderLeft: "2px solid blue"}} {...props} />,
    // TODO: Do this
    ol: ({node, ...props}) => <ol style={{listStyle: "decimal", paddingLeft: "2rem"}} {...props} />,
    // TODO: Do this
    ul: ({node, ...props}) => <ul style={{listStyle: "disc", paddingLeft: "2rem"}} {...props} />,
    // TODO: Do this
    img: ({node, ...props}) => <img {...props} className="tw-w-full" />,
    // TODO: Do this
    a: ({node, ...props}) => <a {...props} className="tw-underline gjo-text-foreground-900 tw-decoration-foreground-900-light dark:tw-decoration-foreground-900-dark hover:tw-decoration-primary-300-light hover:dark:tw-decoration-primary-300-dark tw-underline-offset-2 hover:tw-text-primary-300-dark tw-duration-200" target="_blank" />,
    // br: ({node, ...props}) => <div {...props} className="tw-w-full tw-outline tw-outline-2 tw-outline-red-400" />,
};

// export function transformTextForReactMarkdown(text: string | null): string | null {
//     if (text == null) {
//         return null;
//     }

//     return text.replace(/\n/g, "&nbsp;\n");
// }
