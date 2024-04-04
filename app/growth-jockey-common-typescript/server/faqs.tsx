import {getSingletonValue} from "~/global-common-typescript/utilities/utilities";
import {Faq} from "~/growth-jockey-common-typescript/typeDefinitions";

export async function getFaq(id: string): Promise<Faq | Error> {
    const faq = getSingletonValue(Object.entries(faqs).filter((kvp) => kvp[0] == id))[1];

    return faq;
}

export async function getFaqs(ids: Array<string>): Promise<Array<Faq> | Error> {
    const faqs = [];

    for (const id of ids) {
        const faq = await getFaq(id);

        if (faq == null) {
            return new Error("d0fae049-fdc1-48df-b9f4-f93694340268");
        }

        if (faq instanceof Error) {
            return faq;
        }

        faqs.push(faq);
    }

    return faqs;
}

const faqs: {
    [id: string]: Faq;
} = {
    "capabilities/demand-generation/1": {
        question: "How do you identify and target the right audience for demand generation?",
        answer: "Research your ideal customer profile (ICP) and use buyer personas to understand your target audience's needs and preferences. Use data and analytics to refine your targeting.",
    },
    "capabilities/demand-generation/2": {
        question: "What role does content marketing play in demand generation?",
        answer: "Content marketing is crucial for educating and engaging prospects. High-quality content attracts and retains the attention of potential customers.",
    },
    "capabilities/demand-generation/3": {
        question: "How does demand generation contribute to customer retention and long-term growth?",
        answer: "By consistently engaging and providing value to your audience, demand generation efforts can help foster customer loyalty, leading to repeat business and referrals.",
    },
    "capabilities/demand-generation/4": {
        question: "Can demand generation be successful on a limited budget?",
        answer: "Yes, it's possible to succeed with a limited budget by focusing on cost-effective channels and optimizing campaigns based on data and performance.",
    },
};
