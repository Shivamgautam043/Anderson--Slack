// import * as Sentry from "@sentry/remix";

export function logFrontendError(error: Error) {
    console.log(error);

    // Sentry.init({
    //     dsn: "https://673eb1e42779403496a540af240d2e72@o4504745643343872.ingest.sentry.io/4504745651339264",
    //     tracesSampleRate: 1.0,
    // });
    // Sentry.captureException(error);
}

export async function logToNewRelic(action: string, data: any) {
    var headers = new Headers();
    headers.append("Api-Key", "eu01xx305ee4772ab0b82771859abab6194dNRAL");
    headers.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        attributes: {
            action: action,
            ...data,
        },
    });

    var requestOptions = {
        method: "POST",
        headers: headers,
        body: raw,
    };

    fetch("https://log-api.eu.newrelic.com/log/v1", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
}
