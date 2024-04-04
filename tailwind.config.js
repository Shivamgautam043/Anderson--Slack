/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./root.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "body-bg-1": "#091333",
                "solid-bg": "#0c0d13",
                "solid-surface-1": "#13151f",
                "solid-surface-2": "#1a213c",
                "widget-bg": "#181c2e",
                "empty-widget-bg": "#222638",
                // "empty-widget-icon": "#1f2131",
                "primary-color-1": "#106CDA",
                "secondary-color-1": "#00A2ED",
                "red-negative": "#77343E",
                "text-color-0": "#666970",
                "text-color-1": "#B2B4B9",
                "text-color-2": "#F5F5F5",
                "primary-border-1": "#535D88",
                "primary-border-2": "#3F445A",
                "surface-1": "#251365",
                "surface-2": "#1A213C",
                // "widget-selected-stroke": "#2045d8",
            },
            fontSize: {
                base: ["1rem"],
            },
            spacing: {
                default: "2rem",
            },
        },
    },
    // plugins: [
    //     plugin(({addVariant}) => {
    //         addVariant("radix-tab-active", "&[data-state='active']");
    //         addVariant("hocus", ["&:hover", "&:focus"]);
    //     }),
    // ],
    prefix: "tw-",
};
