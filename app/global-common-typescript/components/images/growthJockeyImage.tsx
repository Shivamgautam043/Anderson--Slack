// import {Transition} from "@headlessui/react";
import {useEffect, useRef, useState} from "react";
import {BlurhashCanvas} from "react-blurhash";
import type {BlurHash, Integer} from "~/common--type-definitions/typeDefinitions";
import {ImageCdnProvider} from "~/common--type-definitions/typeDefinitions";
import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

export function getAbsolutePathForRelativePath(relativePath: string, imageCdnProvider: ImageCdnProvider, width: number | null, height: number | null) {
    // TODO: Add some sort of logic to only have a fixed number of image sizes
    // TODO: Add some sort of ensure we replace a url with a higher resolution url to save bandwidth

    if (imageCdnProvider == ImageCdnProvider.GrowthJockey) {
        return `https://images.growthjockey.com${relativePath}`;
    } else if (imageCdnProvider == ImageCdnProvider.Imgix) {
        return [
            `https://growthjockey.imgix.net${relativePath}`,
            width == null ? null : `?w=${width}`,
            height == null ? null : `${width == null ? "?" : "&"}h=${height}`,
            width == null || height == null ? null : "&fit=crop",
        ].join("");
        //return [`https://growthjockey.imgix.net${relativePath}`, width == null ? null : `?w=${width}`, height == null ? null : `${width == null ? "?" : "&"}h=${height}`].join("");
    } else if (imageCdnProvider == ImageCdnProvider.Bunny) {
        return [
            `https://intellsys-optimizer.b-cdn.net${relativePath}?quality=85`,
            width == null ? null : `&width=${width}`,
            height == null ? null : `&height=${height}`,
            width == null || height == null ? null : `&aspect_ratio=${width}:${height}`,
        ].join("");
    } else {
        throw new Error(`Unknown imageCdnProvider ${imageCdnProvider}`);
    }
}

const useImageLoaded = (): {ref: React.RefObject<HTMLImageElement>; loaded: boolean; onLoad: () => void} => {
    const [loaded, setLoaded] = useState(false);
    const ref = useRef<HTMLImageElement>(null);

    const onLoad = () => {
        setLoaded(true);
    };

    useEffect(() => {
        if (ref.current && ref.current.complete) {
            onLoad();
        }
    });

    return {ref, loaded, onLoad};
};

// Use wrapperDivClassName to control image size
// Use width and height to set aspect ratio
// Not meant to be used directly by consumers
// TODO: Handle error states
// TODO: Handle transparent images
export function GrowthJockeyImageRaw({
    src,
    width,
    height,
    alt,
    blurHash,
    wrapperClassName,
    wrapperStyle,
    imageClassName,
    imageStyle,
    blurHashClassName,
    blurHashStyle,
    loading,
}: {
    src: string;
    width: Integer;
    height: Integer;
    alt?: string;
    blurHash?: BlurHash;
    wrapperClassName?: string;
    wrapperStyle?: {[attribute: string]: string};
    imageClassName?: string;
    imageStyle?: {[attribute: string]: string};
    blurHashClassName?: string;
    blurHashStyle?: {[attribute: string]: string};
    loading?: "eager" | "lazy";
}) {
    const {ref, loaded, onLoad} = useImageLoaded();

    return (
        <div
            className={wrapperClassName}
            style={{display: "grid", ...wrapperStyle}}
        >
            <img
                ref={ref}
                onLoad={onLoad}
                src={src}
                alt={alt}
                width={width}
                height={height}
                // TODO: Gradual fade-in using opacity and animation-duration?
                className={imageClassName}
                style={{gridRowStart: "1", gridColumnStart: "1", width: "100%", height: "100%", visibility: loaded ? "visible" : "hidden", ...imageStyle}}
                loading={loading ?? "lazy"}
            />

            {/* TODO: Evaluate the performance trade-offs of using transition vs hiding normally */}
            {/* <Transition
                as="div"
                show={loaded != true}
                className="tw-col-start-1 tw-row-start-1 tw-w-full tw-h-full"
                enter="tw-ease-out tw-transition-all tw-duration-200"
                enterFrom="tw-opacity-0"
                enterTo="tw-opacity-100"
                leave="tw-ease-in tw-transition-all tw-duration-200"
                leaveFrom="tw-opacity-100"
                leaveTo="tw-opacity-0"
            >
                <BlurhashCanvas
                    hash={blurHash}
                    width={16}
                    height={12}
                    className={blurHashClassName}
                    style={{width: "100%", height: "100%", ...blurHashStyle}}
                />
            </Transition> */}

            {blurHash == null ? null : (
                <div
                    className={concatenateNonNullStringsWithSpaces("tw-col-start-1 tw-row-start-1 tw-w-full tw-h-full tw-ease-in tw-duration-200", loaded != true ? "tw-opacity-100" : "tw-opacity-0")}
                >
                    <BlurhashCanvas
                        hash={blurHash}
                        width={16}
                        height={12}
                        className={blurHashClassName}
                        style={{width: "100%", height: "100%", ...blurHashStyle}}
                    />
                </div>
            )}
        </div>
    );
}
