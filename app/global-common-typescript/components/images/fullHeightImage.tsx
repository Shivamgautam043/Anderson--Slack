import {useResizeDetector} from "react-resize-detector";
import {GrowthJockeyImageRaw, getAbsolutePathForRelativePath} from "~/global-common-typescript/components/images/growthJockeyImage";
import type {ImageCdnProvider, ImageMetadata} from "~/common--type-definitions/typeDefinitions";

// Image that fills the height of the parent container. Maintains aspect ratio.
export function FullHeightImageInternal({
    relativePath,
    className,
    loading,
    imageMetadata,
    imageCdnProvider,
    resolutionMultiplier,
    wrapperClassName,
}: {
    relativePath: string;
    className?: string;
    loading?: "eager" | "lazy";
    imageMetadata: ImageMetadata;
    imageCdnProvider: ImageCdnProvider;
    resolutionMultiplier?: number;
    wrapperClassName?: string;
}) {
    const {height: containerHeight, ref} = useResizeDetector();

    let src: string | null = null;
    if (containerHeight != null) {
        src = getAbsolutePathForRelativePath(imageMetadata.finalUrl, imageCdnProvider, null, containerHeight * (resolutionMultiplier ?? 1));
    }

    return (
        <div
            className="tw-h-full"
            ref={ref}
        >
            {src == null ? (
                <div
                    className={className}
                    style={{height: "100%", aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
                />
            ) : (
                <GrowthJockeyImageRaw
                    src={src}
                    width={imageMetadata.width}
                    height={imageMetadata.height}
                    blurHash={imageMetadata.blurHash}
                    wrapperStyle={{height: "100%", aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
                    imageClassName={className}
                    blurHashClassName={className}
                    blurHashStyle={{aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
                    loading={loading}
                    wrapperClassName={wrapperClassName}
                />
            )}
        </div>
    );
}
