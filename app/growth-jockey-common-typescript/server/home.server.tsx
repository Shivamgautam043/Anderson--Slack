import {imageMetadataLibrary} from "~/imageMetadataLibrary";

export type GlobalLeader = {
    imageRelativePath: string;
    nameContendId: string;
    designationContendId: string;
    companyContentId: string;
    quoteContendId: string;
};

export async function getGlobalLeaders(): Promise<Array<GlobalLeader>> {
    // K.Vijaya Kumar	MD & CEO at SAR Electric Mobility	SAR Electric Mobility
    // Paramjit Singh Nayyar	Chief Human Resources Officer	Hero Housing Finance
    // Suraj Saharan	Co-Founder at Delhivery	Delhivery
    // Rohit Kapoor	Chief Executive Officer - Food Marketplace, Swiggy	Swiggy	The companies that invest in their digital capabilities today will be the ones that dominate the market tomorrow.
    // Vir Inder Nath	Chief Executive Officer - 	airtel - Homes (Xstream Fiber, Broadband, FTTH)	Digital disruption is not a threat, but an opportunity for businesses to reinvent themselves and create new value for their customers

    // Gaurav Ajmera	Founder	Vetic	Businesses that can pivot quickly in response to changing trends and consumer demands will emerge as the winners in the digital age.
    // Sarang Kanade	President - Motorcycle Business at Bajaj Auto Ltd	Bajaj Auto Ltd	The future of business is digital, and those who can master the digital landscape will be the ones that thrive in the years to come.
    // Pritesh Talwar	Growth Officer	Jumbo Electronics Company Limited (LLC)	Data-driven insights are the secret sauce that can help businesses gain a competitive edge and drive growth in the digital age.

    // Need images
    // Sriraman Jagannathan	VP Global Payment Products at Delivery Hero	Delivery Hero	"In the age of technology, businesses that don't innovate and adapt will be left behind in the dust."
    // Vibhanshu Abhishek	Co-Founder and CEO	Alltius.ai	Artificial intelligence is not a replacement for human intelligence, but a complement that can enhance our decision-making and problem-solving capabilities.
    // Ganesh Ananthanarayanan	Chief Operating Officer, Airtel Payments Bank	Airtel Payments Bank	Digital capabilities are no longer a luxury, but a necessity for businesses looking to remain competitive and relevant in the modern landscape.
    // Sandeep Prasad	D2C & e-commerce Business Head and Private Investor	Livpure	To succeed in today's hyper-competitive business environment, you need to be tech-savvy, data-driven, and always on the lookout for the next big thing.
    // Willy C	VP Sales and Marketing	Lectrix EV

    const globalLeaders: Array<GlobalLeader> = [
        {
            imageRelativePath: "/growthjockey/home/3/mentors/sarang-kanade.jpg",
            nameContendId: "c90cf570-3bbe-4260-9e9f-0c2daa88d580",
            designationContendId: "cd4dbcb8-d604-4500-a63b-18fe1e0ce943",
            companyContentId: "e7a8e73a-d2b5-4381-b4ba-c1f1daca622e",
            quoteContendId: "2b525c71-6694-4979-a48c-dcf196f661fe",
        },
        {
            imageRelativePath: "/growthjockey/home/3/mentors/gaurav-ajmera.jpg",
            nameContendId: "87531046-90cf-4d61-b938-213153c598a4",
            designationContendId: "fdbd5e9b-e7b7-442f-bce7-e8982c4c081f",
            companyContentId: "7390f139-3c3c-4166-8c83-1ea8930e6b6a",
            quoteContendId: "f237c0f5-21ed-40b3-b0e5-3e7be0a9cfa7",
        },
        {
            imageRelativePath: "/growthjockey/home/3/mentors/pritesh-talwar.jpg",
            nameContendId: "e1da02c8-dfb7-4af4-896b-979cf8d9c68a",
            designationContendId: "994ee732-9e87-402e-bd0d-18651d21d914",
            companyContentId: "0f96d4a3-be3a-4313-aa56-205dcffc421b",
            quoteContendId: "3d28b09e-15e2-4d2c-856a-f60a4466fd6a",
        },
        // {
        //     imageRelativePath: "/growthjockey/home/3/mentors/k-vijaya-kumar.jpg",
        //     nameContendId: "8c5224fc-a200-4efb-88d4-a18a474576a8",
        //     designationContendId: "633c7b7a-5b20-4969-9195-2a30c74e3892",
        //     companyContentId: "bcce0e0b-cf7b-4aa1-bd77-79e47255aad7",
        //     quoteContendId: "9fc1eba0-c2a0-4d74-8ca2-7136dabd36e3",
        // },
        // {
        //     imageRelativePath: "/growthjockey/home/3/mentors/paramjit-singh-nayyar.jpg",
        //     nameContendId: "dd341fb1-8cda-4d5c-a0c7-bfea454c4b73",
        //     designationContendId: "9d376af2-1df5-4a06-94f8-0f0edff62ffd",
        //     companyContentId: "fc0da5bd-0701-4019-aab6-9ebc2d359b66",
        //     quoteContendId: "ebbf029b-9bcd-4dc4-ba25-298ffd2ebe13",
        // },
        // {
        //     imageRelativePath: "/growthjockey/home/3/mentors/suraj-saharan.jpg",
        //     nameContendId: "bf4e26eb-5c6f-4d5c-af05-d54c1b41bda8",
        //     designationContendId: "2a124238-dfe4-4b77-b6a2-ee86fb0c1d0e",
        //     companyContentId: "b70529eb-226a-4155-b2c1-bfcdc27fda31",
        //     quoteContendId: "61bd403b-d196-485d-9b57-38369a74f944",
        // },
        {
            imageRelativePath: "/growthjockey/home/3/mentors/rohit-kapoor.jpg",
            nameContendId: "236d7ae4-09e0-48a3-a7e7-9d430306e8d4",
            designationContendId: "1eb5c6d0-c0bf-4b10-93fc-4b5664be72ba",
            companyContentId: "d862bd2b-6462-4d43-9b5a-38cc0188bdb6",
            quoteContendId: "da5731cc-eaa5-477c-9641-32928c3b9a0b",
        },
        {
            imageRelativePath: "/growthjockey/home/3/mentors/vir-inder-nath.jpg",
            nameContendId: "91c4aba2-054a-4db9-a913-2925b8e7c23b",
            designationContendId: "8117e1b4-9cdc-434e-893c-656da653fe52",
            companyContentId: "6826c9d1-a668-454c-8290-73acbcf92b55",
            quoteContendId: "ae6b08dd-db1d-4895-bb2c-01fcd4c6f159",
        },
    ];

    return globalLeaders;
}

export type HeroBannerSlide = {
    title: string;
    subtitle: string;
    imageDetails: {
        placeholderColor: string;
        desktopUrl: string;
        mobileUrl: string;
    };
};

export async function getHeroBannerSlides(): Promise<Array<HeroBannerSlide>> {
    const heroBannerSlides = [
        {
            title: "Build With Us",
            subtitle: "Your Partner for Business Growth",
            imageDetails: {
                placeholderColor: imageMetadataLibrary[`/growthjockey/home/1/1-mobile.jpg`].placeholderColor,
                desktopUrl: imageMetadataLibrary[`/growthjockey/home/1/1-desktop.jpg`].finalUrl,
                mobileUrl: imageMetadataLibrary[`/growthjockey/home/1/1-mobile.jpg`].finalUrl,
            },
        },
        {
            title: "Partner for Success",
            subtitle: "Building Strong Businesses",
            imageDetails: {
                placeholderColor: imageMetadataLibrary[`/growthjockey/home/1/2-mobile.jpg`].placeholderColor,
                desktopUrl: imageMetadataLibrary[`/growthjockey/home/1/2-desktop.jpg`].finalUrl,
                mobileUrl: imageMetadataLibrary[`/growthjockey/home/1/2-mobile.jpg`].finalUrl,
            },
        },
        {
            title: "Join Our Journey",
            subtitle: "Your Key to Business Success",
            imageDetails: {
                placeholderColor: imageMetadataLibrary[`/growthjockey/home/1/3-mobile.jpg`].placeholderColor,
                desktopUrl: imageMetadataLibrary[`/growthjockey/home/1/3-desktop.jpg`].finalUrl,
                mobileUrl: imageMetadataLibrary[`/growthjockey/home/1/3-mobile.jpg`].finalUrl,
            },
        },
    ];

    return heroBannerSlides;
}
