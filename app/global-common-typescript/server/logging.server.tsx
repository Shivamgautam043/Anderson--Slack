// import * as Sentry from "@sentry/remix";

export function logBackendError(error: Error) {
    console.log(error);

    // Sentry.init({
    //     dsn: "https://673eb1e42779403496a540af240d2e72@o4504745643343872.ingest.sentry.io/4504745651339264",
    //     tracesSampleRate: 1.0,
    // });
    // Sentry.captureException(error);
}
