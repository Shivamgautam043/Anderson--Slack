import {useSearchParams} from "@remix-run/react";
import {useEffect, useState} from "react";
import {getStringFromUnknown, safeParse} from "~/global-common-typescript/utilities/typeValidationUtilities";

export function useUtmSearchParameters(): {[searchParameter: string]: string} {
    const [searchParams, setSearchParams] = useSearchParams();
    const [utmSearchParameters, setUtmSearchParameters] = useState({});

    useEffect(() => {
        const utmSearchParameters_: {[searchParameter: string]: string} = {};

        addNonNullParameterToDictionary(searchParams, "utm_adgroupname", utmSearchParameters_);
        addNonNullParameterToDictionary(searchParams, "utm_campaign", utmSearchParameters_);
        addNonNullParameterToDictionary(searchParams, "utm_content", utmSearchParameters_);
        addNonNullParameterToDictionary(searchParams, "utm_medium", utmSearchParameters_);
        addNonNullParameterToDictionary(searchParams, "utm_source", utmSearchParameters_);
        addNonNullParameterToDictionary(searchParams, "utm_term", utmSearchParameters_);
        addNonNullParameterToDictionary(searchParams, "gclid", utmSearchParameters_);
        addNonNullParameterToDictionary(searchParams, "fbclid", utmSearchParameters_);

        if (Object.keys(utmSearchParameters_).length > 0) {
            localStorage.setItem("utmSearchParameters", JSON.stringify(utmSearchParameters_));
            setUtmSearchParameters(utmSearchParameters_);
            return;
        } else {
            const storedUtmSearchParameters = localStorage.getItem("utmSearchParameters");
            if (storedUtmSearchParameters != null) {
                setUtmSearchParameters(JSON.parse(storedUtmSearchParameters));
                return;
            }
        }
    }, [searchParams]);

    return utmSearchParameters;
}

export function addNonNullParameterToDictionary(searchParams: URLSearchParams, searchParameter: string, utmSearchParameters: {[searchParameter: string]: string}) {
    const searchParameterValue = safeParse(getStringFromUnknown, searchParams.get(searchParameter));
    if (searchParameterValue != null) {
        utmSearchParameters[searchParameter] = searchParameterValue;
    }
}
