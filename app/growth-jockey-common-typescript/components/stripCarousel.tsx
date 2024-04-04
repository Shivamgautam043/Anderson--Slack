import {useState} from "react";
import {ArrowRightCircle} from "react-bootstrap-icons";
import {CoverImage} from "~/componentLibrary/images/coverImage";
import {GrowthJockeyContent} from "~/componentLibrary/componentLibrary/growthJockeyContent";
import {ItemBuilder} from "~/global-common-typescript/components/itemBuilder";
import {concatenateNonNullStringsWithSpaces} from "~/global-common-typescript/utilities/utilities";

export function StripCarousel(props: {slides: Array<any>; initialIndex: number}) {
    const [activeSlideIndex, setActiveSlideIndex] = useState(props.initialIndex);

    return (
        <div className="tw-overflow-hidden">
            <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-end tw-gap-x-4 tw-gap-y-4">
                <ItemBuilder
                    items={props.slides}
                    itemBuilder={(slide, slideIndex) => (
                        <div
                            className={concatenateNonNullStringsWithSpaces(
                                "tw-grid tw-place-items-center md:tw-place-items-end tw-duration-200 tw-relative tw-cursor-pointer",
                                slide.slideClass,
                                slideIndex == activeSlideIndex ? slide.activeSlideClass : slide.inactiveSlideClass,
                            )}
                            onClick={(e) => setActiveSlideIndex(slideIndex)}
                            key={slideIndex}
                        >
                            <CoverImage
                                relativePath={slide.backgroundImageRelativePath}
                                className="tw-absolute tw-inset-0"
                            />

                            {slideIndex == activeSlideIndex && (
                                <div className="tw-z-10 tw-absolute tw-left-4 md:tw-left-8 tw-bottom-4 md:tw-bottom-8">
                                    <GrowthJockeyContent
                                        contentId={slide.activeSlideContent}
                                        className="tw-max-w-[25rem] tw-text-foreground-900-dark"
                                    />
                                </div>
                            )}

                            {slideIndex == activeSlideIndex && (
                                <a
                                    className="tw-z-10 tw-absolute tw-left-4 tw-top-4 md:tw-left-8 md:tw-top-8 tw-grid tw-grid-cols-[auto_auto] tw-text-foreground-900-dark tw-gap-2"
                                    href={slide.activeSlideLink}
                                >
                                    <ArrowRightCircle className="tw-w-6 tw-h-6 tw-col-start-1 " />
                                    <div className="gjo-text-body tw-col-start-2">Read more</div>
                                </a>
                            )}

                            {slideIndex != activeSlideIndex && <div className={concatenateNonNullStringsWithSpaces("tw-absolute tw-z-1 tw-inset-0", slide.overlayClass)} />}

                            {slideIndex != activeSlideIndex && (
                                <div className="tw-z-10 tw-absolute gjo-text-title  md:tw-left-1/2 md:-tw-rotate-90 md:tw-origin-left">
                                    <GrowthJockeyContent
                                        contentId={slide.inactiveSlideText}
                                        className="tw-min-w-max tw-text-foreground-900-dark"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

// export function StripCarousel() {
//     const emblaAutoplay = Autoplay({delay: 5000});
//     const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: "start", draggable: false}, [emblaAutoplay]);

//     // const onSlideClick = useCallback(
//     //     (index) => {
//     //         if (emblaApi && emblaApi.clickAllowed()) console.log(index);
//     //     },
//     //     [emblaApi],
//     // );

//     useEffect(() => {
//         if (emblaApi) {
//             emblaApi.on("select", e => console.log("selected", emblaApi.selectedScrollSnap()));
//             emblaApi.on("settle", e => console.log("settled", emblaApi.selectedScrollSnap()));
//         }
//     }, [emblaApi]);

//     // console.log(emblaApi == null ? 0 : emblaApi.selectedScrollSnap());

//     const slides = [
//         {
//             text: "Slide 1",
//             slideClass: "tw-bg-red-400",
//         },
//         {
//             text: "Slide 2",
//             slideClass: "tw-bg-green-400",
//         },
//         {
//             text: "Slide 3",
//             slideClass: "tw-bg-yellow-400",
//         },
//         {
//             text: "Slide 4",
//             slideClass: "tw-bg-purple-400",
//         },
//         {
//             text: "Slide 5",
//             slideClass: "tw-bg-cyan-400",
//         },
//     ];

//     return (
//         <div className="tw-overflow-hidden" ref={emblaRef}>
//             <div className="tw-flex tw-flex-row tw-gap-x-8 tw-pl-8">
//                 <ItemBuilder
//                     items={slides}
//                     itemBuilder={(slide, slideIndex) => (
//                         <div
//                             className={concatenateNonNullStringsWithSpaces(
//                                 "tw-grid tw-place-items-center",
//                                 slide.slideClass,
//                                 slideIndex == (emblaApi == null ? 0 : emblaApi.selectedScrollSnap()) ? "tw-aspect-video tw-flex-[0_0_40%]" : "tw-flex-[0_0_10%]",
//                             )}
//                             key={slideIndex}
//                         >
//                             {slide.text}
//                         </div>
//                     )}
//                 />
//             </div>
//         </div>
//     );
// }
