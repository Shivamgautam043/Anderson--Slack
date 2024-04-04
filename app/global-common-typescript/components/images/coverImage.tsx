import {useResizeDetector} from "react-resize-detector";
import {getAbsolutePathForRelativePath, GrowthJockeyImageRaw} from "~/global-common-typescript/components/images/growthJockeyImage";
import type {ImageCdnProvider, ImageMetadata} from "~/common--type-definitions/typeDefinitions";
import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

// Image that fills the parent container. Maintains aspect ratio.
export function CoverImageInternal({
    relativePath,
    className,
    loading,
    imageMetadata,
    imageCdnProvider,
    imageClassName,
    resolutionMultiplier,
}: {
    relativePath: string;
    className?: string;
    loading?: "eager" | "lazy";
    imageMetadata: ImageMetadata;
    imageCdnProvider: ImageCdnProvider;
    imageClassName?: string;
    resolutionMultiplier?: number;
}) {
    const {width: containerWidth, height: containerHeight, ref} = useResizeDetector();

    let src: string | null = null;
    if (containerWidth != null && containerHeight != null) {
        src = getAbsolutePathForRelativePath(imageMetadata.finalUrl, imageCdnProvider, containerWidth * (resolutionMultiplier ?? 1), containerHeight * (resolutionMultiplier ?? 1));
    }

    return (
        <div
            className={concatenateNonNullStringsWithSpaces("tw-w-full tw-h-full", className)}
            ref={ref}
        >
            {src == null ? (
                <div style={{width: "100%", height: "100%"}} />
            ) : (
                <GrowthJockeyImageRaw
                    src={src}
                    width={imageMetadata.width}
                    height={imageMetadata.height}
                    blurHash={imageMetadata.blurHash}
                    wrapperStyle={{gridTemplateRows: "minmax(0, 1fr)", gridTemplateColumns: "minmax(0, 1fr)", width: "100%", height: "100%"}}
                    imageStyle={{objectFit: "cover"}}
                    blurHashStyle={{width: "100%", height: "100%", objectFit: "cover"}}
                    imageClassName={imageClassName}
                    loading={loading}
                />
            )}
        </div>
    );

    // wrapperDivClassName="tw-absolute tw-w-full tw-h-full tw-object-cover -tw-z-10" />
}
