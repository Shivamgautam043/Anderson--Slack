import {getSingletonValue} from "~/global-common-typescript/utilities/utilities";
import type {CaseStudy} from "~/growth-jockey-common-typescript/typeDefinitions";

export async function getCaseStudy(id: string): Promise<CaseStudy | Error> {
    const caseStudy = getSingletonValue(Object.entries(caseStudies).filter((kvp) => kvp[0] == id))[1];

    return caseStudy;
}

export async function getCaseStudies(ids: Array<string>): Promise<Array<CaseStudy> | Error> {
    const caseStudies = [];

    for (const id of ids) {
        const caseStudy = await getCaseStudy(id);

        if (caseStudy == null) {
            return new Error("41c14ba0-0f26-415a-a7e9-8622293dcb76");
        }

        if (caseStudy instanceof Error) {
            return caseStudy;
        }

        caseStudies.push(caseStudy);
    }

    return caseStudies;
}

const caseStudies: {
    [id: string]: CaseStudy;
} = {
    "food-tech": {
        title: "Food Tech",
        imageRelativeUrl: "/growthjockey/capabilities/693ac38d-1d88-45ac-b995-d1cfaac4ccd2/case-studies/1.jpg",
        problem: "Low website conversion rates and customer engagement due to limited real-time support.",
        solution: "Implemented live chat support to address customer queries and provide instant assistance.",
        metrics: [
            {
                metricValue: "20%",
                metric: "Revenue Increase",
            },
            {
                metricValue: "40%",
                metric: "Customer Satisfaction",
            },
            {
                metricValue: "30%",
                metric: "Conversion Rate Boost",
            },
        ],
    },
};
