import {useResizeDetector} from "react-resize-detector";
import {GrowthJockeyImageRaw, getAbsolutePathForRelativePath} from "~/global-common-typescript/components/images/growthJockeyImage";
import type {ImageCdnProvider, ImageMetadata} from "~/common--type-definitions/typeDefinitions";

// Image that occupies a fixed width. Maintains aspect ratio.
export function FixedWidthImageInternal({
    relativePath,
    width,
    className,
    loading,
    imageMetadata,
    imageCdnProvider,
    resolutionMultiplier,
}: {
    relativePath: string;
    width: string;
    className?: string;
    loading?: "eager" | "lazy";
    imageMetadata: ImageMetadata;
    imageCdnProvider: ImageCdnProvider;
    resolutionMultiplier?: number;
}) {
    const {width: containerWidth, ref} = useResizeDetector();

    let src: string | null = null;
    if (containerWidth != null) {
        src = getAbsolutePathForRelativePath(imageMetadata.finalUrl, imageCdnProvider, containerWidth * (resolutionMultiplier ?? 1), null);
    }

    return (
        <div
            style={{width: width, aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
            ref={ref}
        >
            {src == null ? (
                <div
                    className={className}
                    style={{width: width, aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
                />
            ) : (
                <GrowthJockeyImageRaw
                    src={src}
                    width={imageMetadata.width}
                    height={imageMetadata.height}
                    blurHash={imageMetadata.blurHash}
                    wrapperStyle={{width: width, aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
                    imageClassName={className}
                    blurHashClassName={className}
                    blurHashStyle={{aspectRatio: `${imageMetadata.width}/${imageMetadata.height}`}}
                    loading={loading}
                />
            )}
        </div>
    );
}
