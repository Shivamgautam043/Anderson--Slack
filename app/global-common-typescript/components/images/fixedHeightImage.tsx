import {FullHeightImageInternal} from "~/global-common-typescript/components/images/fullHeightImage";
import type {ImageCdnProvider, ImageMetadata} from "~/common--type-definitions/typeDefinitions";

// Image that occupies a fixed height. Maintains aspect ratio.
// export function FixedHeightImage({relativePath, height, className, loading}: {relativePath: string; height: string; className?: string; loading?: "eager" | "lazy"}) {
//     const websiteConfiguration = useContext(WebsiteConfigurationContext);

//     const {height: containerHeight, ref} = useResizeDetector();

//     const imageMetadata = getMetadataForImage(relativePath);

//     let src: string | null = null;
//     if (containerHeight != null) {
//         src = getAbsolutePathForRelativePath(imageMetadata.finalUrl, websiteConfiguration.imageCdnProvider, null, containerHeight);
//         // TODO: TEMP HACK TO KEEP LIVGUARD WORKING
//         if (websiteConfiguration.imageCdnProvider == ImageCdnProvider.Imgix) {
//             src = getAbsolutePathForRelativePath(relativePath, websiteConfiguration.imageCdnProvider, null, containerHeight);
//         }
//     }

//     return (
//         <div
//             style={{height: height, aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
//             ref={ref}
//         >
//             {src == null ? (
//                 <div
//                     className={className}
//                     style={{background: imageMetadata.placeholderColor, height: height, aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
//                 />
//             ) : (
//                 <GrowthJockeyImageRaw
//                     src={src}
//                     width={imageMetadata.width}
//                     height={imageMetadata.height}
//                     placeholderColor={imageMetadata.placeholderColor}
//                     blurHash={imageMetadata.blurHash}
//                     wrapperStyle={{height: height, aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
//                     imageClassName={className}
//                     blurHashClassName={className}
//                     blurHashStyle={{aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
//                     loading={loading}
//                 />
//             )}
//         </div>
//     );
// }

// TODO: The above implementation isn't working. Figure out why, and remove this one.
export function FixedHeightImageInternal({
    relativePath,
    height,
    className,
    loading,
    imageMetadata,
    imageCdnProvider,
    resolutionMultiplier,
}: {
    relativePath: string;
    height: string;
    className?: string;
    loading?: "eager" | "lazy";
    imageMetadata: ImageMetadata;
    imageCdnProvider: ImageCdnProvider;
    resolutionMultiplier?: number;
}) {
    return (
        <div style={{height: height}}>
            <FullHeightImageInternal
                relativePath={relativePath}
                className={className}
                loading={loading}
                imageMetadata={imageMetadata}
                imageCdnProvider={imageCdnProvider}
                resolutionMultiplier={resolutionMultiplier}
            />
        </div>
    );
}
