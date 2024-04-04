import {ColorSchemeScript, MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import type {LinksFunction, MetaFunction} from "@remix-run/node";
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useRouteError,
} from "@remix-run/react";
import "~/tailwind.css";
// Ensure this is always below tailwind styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export const meta: MetaFunction = ({data, matches}) => {
    return [
        {
            title: "Intellsys",
        },
    ];
};

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Poppins",
    },
];

export default function App() {
    return (
        <html
            lang="en"
            style={{height: "100%"}}
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <Meta />
                <Links />
                <ColorSchemeScript defaultColorScheme="dark" />
            </head>

            <body
                className="tw-text-base tw-text-text-color-1 tw-h-full"
                style={{display: "none"}}
            >
                <MantineProvider defaultColorScheme="dark">
                    <Notifications
                        position="top-right"
                        autoClose={5000}
                        zIndex={1000}
                    />

                    <Outlet />

                    <ScrollRestoration />
                    <Scripts />
                </MantineProvider>
            </body>
        </html>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    console.log(error);

    return (
        <html
            lang="en"
            // TODO: Remove this?
            style={{height: "100%"}}
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <Meta />
                <Links />
            </head>

            <body
                className="tw-text-base tw-text-text-color-1 tw-h-full"
                style={{display: "none"}}
            >
                Error
            </body>
        </html>
    );
}
