// export enum Theme {
//     Dark = "dark",
//     Light = "light",
// }

import {DateTime} from "luxon";
import {z} from "zod";
import type {
    Iso8601DateTime,
    Uuid,
} from "~/common--type-definitions/typeDefinitions";
import {getUuidFromUnknown} from "~/global-common-typescript/utilities/typeValidationUtilities";
import type {ReportPage} from "~/routes/$companyId.report.edit.$reportId/state";
import type {
    User,
    Company,
    CurrentCompany,
    Profile,
    UserPermissionsOnCompany,
} from "~/utilities/typeDefinitions";

// export type UserPreferences = {
//     theme: Theme;
// };

export enum TimeGranularity {
    daily = "Daily",
    weekly = "Weekly",
    monthly = "Monthly",
    // quarterly = "Quarterly",
    hourly = "Hourly",
    yearly = "Yearly",
}

export type EnumDictionary<T extends string | symbol | number, U> = {
    [t in T]: U;
};

export const zodUuidValidator = z
    .string()
    .transform((str) => getUuidFromUnknown(str));

export function transformJsDateToLuxonDateNullable(
    date: Date | null,
): Iso8601DateTime | null {
    return date == null
        ? null
        : (DateTime.fromJSDate(date).setZone("utc").toISO() as Iso8601DateTime);
}

export function transformJsDateToLuxonDate(date: Date): Iso8601DateTime {
    return DateTime.fromJSDate(date).setZone("utc").toISO() as Iso8601DateTime;
}

export type ReportTemplate = {
    id: Uuid;
    name: string;
    categories: Array<ReportTemplateCategories>;
    pages: Array<ReportPage>;
};

export enum ReportTemplateCategories {
    all = "5363e190-7ae3-4da8-9272-06950f8397ce",
    googleAds = "d712aa5f-7da4-4c9b-ba2c-f2a78f16413e",
    facebookAds = "f4b1f1e7-cc34-49fa-a21c-1456b94d6809",
    googleAnalytics = "036cca9c-12bb-4361-90d4-9a9194f617b3",
    instagram = "9426ab59-b0f8-4dd0-bfb2-0200e25a2b51",
    shopify = "1c05dbbb-76ba-4dee-9f91-d880ec918805",
    youtube = "66fcc220-b9d5-432c-b117-4560fa0d7f66",
    facebookPage = "7d6ee7a5-09b6-4a84-92c0-006f44ab372d",
    marketing = "6a7b2792-4818-4c08-bddf-59baced47e1a",
    eCommerce = "a779de24-264f-4599-89cc-609c53e61490",
    // Add more as required
}

export const ReportTemplateCategoriesDisplayMetadata: EnumDictionary<
    ReportTemplateCategories,
    {name: string}
> = {
    [ReportTemplateCategories.all]: {
        name: "All",
    },
    [ReportTemplateCategories.googleAds]: {
        name: "Google Ads",
    },
    [ReportTemplateCategories.facebookAds]: {
        name: "Facebook Ads",
    },
    [ReportTemplateCategories.googleAnalytics]: {
        name: "Google Analytics",
    },
    [ReportTemplateCategories.instagram]: {
        name: "Instagram",
    },
    [ReportTemplateCategories.shopify]: {
        name: "Shopify",
    },
    [ReportTemplateCategories.youtube]: {
        name: "Youtube Analytics",
    },
    [ReportTemplateCategories.facebookPage]: {
        name: "Facebook Page",
    },
    [ReportTemplateCategories.marketing]: {
        name: "Marketing",
    },
    [ReportTemplateCategories.eCommerce]: {
        name: "E-Commerce",
    },
};

export type PageScaffoldData = {
    user: User;
    accessibleCompanies: Array<Company>;
    currentCompany: CurrentCompany;
    userProfile: Profile;
    userPermissions: UserPermissionsOnCompany;
};

export enum Environments {
    dev = "dev",
    staging = "staging",
    prod = "prod",
}
