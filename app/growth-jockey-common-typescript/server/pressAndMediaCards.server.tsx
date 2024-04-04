// import {Uuid} from "~/common--type-definitions/typeDefinitions";
// import {getSingletonValue} from "~/global-common-typescript/utilities/utilities";
// import type {Testimonial} from "~/growth-jockey-common-typescript/typeDefinitions";

// export async function getTestimonial(id: string): Promise<Testimonial | Error> {
//     const testimonial = getSingletonValue(Object.entries(testimonials).filter((kvp) => kvp[0] == id))[1];

//     return testimonial;
// }

// export async function getTestimonials(ids: Array<string>): Promise<Array<Testimonial> | Error> {
//     const testimonials = [];

//     for (const id of ids) {
//         const testimonial = await getTestimonial(id);

//         if (testimonial == null) {
//             return new Error("a4998a0b-b0e2-4d33-9310-854f65b2e54c");
//         }

//         if (testimonial instanceof Error) {
//             return testimonial;
//         }

//         testimonials.push(testimonial);
//     }

//     return testimonials;
// }

// const testimonials: {
//     [id: string]: Testimonial;
// } = {
//     gurpreetBhatia: {
//         companyLogoRelativePath: "/growthjockey/campaigns/testimonials/livguard.png",
//         rating: 5,
//         message:
//             "Livguard Battery & Inverter's collaboration with GrowthJockey has been a game-changer. Spearheading our digital transformation, they built an impactful tech ecosystem, setting the stage for exponential growth. Their AI & Analytics prowess, notably the smart load calculator with an AI-enabled recommendation engine, has enriched customer insights and elevated the buying journey. GrowthJockey has effectively unlocked our next growth wave.",
//         reviewerRelativePath: "/growthjockey/campaigns/testimonials/gurpreet-bhatia.png",
//         reviewerName: "Mr. Gurpreet Bhatia",
//         reviewerDesignation: "CEO, Livguard",
//     },
//     sandeepPrasad: {
//         companyLogoRelativePath: "/growthjockey/campaigns/testimonials/lsh.png",
//         rating: 5,
//         message:
//             "Partnering with GrowthJockey catalyzed a remarkable turnaround in our D2C & eCom business. They addressed our elevated ACOS and plateaued growth, wielding their Tech and Digital prowess to implement a holistic digital strategy. Consequently, we achieved 2.5x growth with an 89% ACOS reduction, via meticulous improvements in key digital metrics. GrowthJockey has undoubtedly earned its position as our trusted, long-term partner.",
//         reviewerRelativePath: "/growthjockey/campaigns/testimonials/sandeep-prasad.png",
//         reviewerName: "Mr. Sandeep Prasad",
//         reviewerDesignation: "Business Head - Digital LSH",
//     },
//     priteshTalwar: {
//         companyLogoRelativePath: "/growthjockey/campaigns/testimonials/livpure.png",
//         rating: 5,
//         message:
//             "Partnering with GrowthJockey has revolutionized our D2C & eCom business in the water purifier and appliance sector. Their strategic mastery has not only cut our ACOS by 89% and boosted growth by 2.5x, but also significantly improved CM & EBIT. They actively helped in shaping our business model, introducing 'Buy or Subscribe' and 'Auto-Renewal', enhancing products, strategizing go-to-market, and holistically delivering the AOP. They are an indispensable part of our journey.",
//         reviewerRelativePath: "/growthjockey/campaigns/testimonials/pritesh-talwar.png",
//         reviewerName: "Mr. Pritesh Talwar",
//         reviewerDesignation: "CEO - Livpure",
//     },
//     kvk: {
//         companyLogoRelativePath: "/growthjockey/campaigns/testimonials/lectrix.png",
//         rating: 5,
//         message:
//             "Embarking on our journey with GrowthJockey has been a pivotal turning point for Lectrix EV. From scratch to a flourishing business, their hands-on approach in strategizing the Business & AOP, Go-to-Market plans, Product Launches, and integrating IoT & AI products has been phenomenal. Their expertise in growth marketing, tech development, and smart operations has propelled us from ZERO to a market leader. GrowthJockey isn't just a partner; they're an integral part of our success story.",
//         reviewerRelativePath: "/growthjockey/campaigns/testimonials/kvk.png",
//         reviewerName: "Mr. KVK",
//         reviewerDesignation: "MD, Lectrix EV",
//     },
//     manjivSingh: {
//         companyLogoRelativePath: "/growthjockey/campaigns/testimonials/deckmount.png",
//         rating: 5,
//         message:
//             "Working with GrowthJockey was the catalyst for our journey at DeckMount Smart Medical Devices. They took us from ground zero to a commanding market presence. With their strategic business & AOP planning, intuitive go-to-market strategies, meticulous product launches, and IoT & AI product integrations, they have helped to shape our identity. Their prowess in growth marketing, tech development, and smart operations have accelerated our growth. GrowthJockey is integral to our business transformation and success.",
//         reviewerRelativePath: "/growthjockey/campaigns/testimonials/manjiv-singh.png",
//         reviewerName: "Mr. Manjiv Singh",
//         reviewerDesignation: "MD, DeckMount Pvt. Ltd.",
//     },
//     ruchirMehta: {
//         companyLogoRelativePath: "/growthjockey/campaigns/testimonials/remedo.png",
//         rating: 5,
//         message:
//             "In our journey from startup to Seed and A series, GrowthJockey has been instrumental for Remedo. They flawlessly navigated us from zero to a thriving business, with robust Business & AOP planning, precise go-to-market strategies, innovative product launches, and integrating cutting-edge IoT & AI. Their holistic approach to growth marketing, technology development, and smart operations, coupled with their ability to drive key digital metrics and boost EBITA and revenue growth, has been pivotal in our success.",
//         reviewerRelativePath: "/growthjockey/campaigns/testimonials/ruchir-mehra.png",
//         reviewerName: "Dr. Ruchir Mehra",
//         reviewerDesignation: "Co-Founder - Remedo",
//     },
//     shaileshGupta: {
//         companyLogoRelativePath: "/growthjockey/campaigns/testimonials/yolobus.png",
//         rating: 5,
//         message:
//             "Our partnership with GrowthJockey has been a beacon for YeloBus during the most challenging times. They expanded our runway, significantly reduced burn rate using innovative product transformation, and increased customer LTV. Their expertise in growth marketing and tech innovation, including AI pricing, paved our path to monetisation, effectively turning the tide. GrowthJockey is our growth-hacking maestro for life.",
//         reviewerRelativePath: "/growthjockey/campaigns/testimonials/shailesh-gupta.png",
//         reviewerName: "Mr. Shailesh Gupta",
//         reviewerDesignation: "Founder & CEO - YOLO Bus acquired by EMT",
//     },
// };
