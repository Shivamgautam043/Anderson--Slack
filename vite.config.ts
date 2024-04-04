import {unstable_vitePlugin as remix} from "@remix-run/dev";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

const isStorybook = process.argv[1]?.includes("storybook");

export default defineConfig({
    plugins: [
        !isStorybook && remix(),
        tsconfigPaths(),
        svgr({
            svgrOptions: {},
        }),
    ],
});
