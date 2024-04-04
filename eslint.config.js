import {FlatCompat} from "@eslint/eslintrc";
// import path from "path";
// import {fileURLToPath} from "url";

// Mimic CommonJS variables
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    // baseDirectory: __dirname, // optional; default: process.cwd()
    // resolvePluginsRelativeTo: __dirname, // optional
});

// "env": {
//     "browser": true,
//     "node": true,
//     "es6": true,
//     "jest": true
//   },

// "settings": {
//     "react": {
//       "version": "detect"
//     }
//   }

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
    ...compat.extends(
        "@remix-run/eslint-config",
        "@remix-run/eslint-config/node",
        "plugin:storybook/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@typescript-eslint/recommended",
    ),
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        rules: {
            semi: "error",
            "prefer-const": "error",
            // "eqeqeq": "error",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "import/no-cycle": "error",

            // "object-curly-spacing": ["warn"],
            // "array-callback-return": ["warn"],
            // "constructor-super": ["warn"],
            // "for-direction": ["warn"],
            // "getter-return": ["warn"],

            // "strict": 0,
            // "react-hooks/rules-of-hooks": "error",
            // "react-hooks/exhaustive-deps": "warn"
        },
        // plugins: ["react", "react-hooks", "jsx-a11y"],
    },
];

// Default remix config
// /** @type {import('eslint').Linter.Config} */
// module.exports = {
//     root: true,
//     parserOptions: {
//         ecmaVersion: "latest",
//         sourceType: "module",
//         ecmaFeatures: {
//             jsx: true,
//         },
//     },
//     env: {
//         browser: true,
//         commonjs: true,
//         es6: true,
//     },

//     // Base config
//     extends: ["eslint:recommended"],

//     overrides: [
//         // React
//         {
//             files: ["**/*.{js,jsx,ts,tsx}"],
//             plugins: ["react", "jsx-a11y"],
//             extends: [
//                 "plugin:react/recommended",
//                 "plugin:react/jsx-runtime",
//                 "plugin:react-hooks/recommended",
//                 "plugin:jsx-a11y/recommended",
//             ],
//             settings: {
//                 react: {
//                     version: "detect",
//                 },
//                 formComponents: ["Form"],
//                 linkComponents: [
//                     {name: "Link", linkAttribute: "to"},
//                     {name: "NavLink", linkAttribute: "to"},
//                 ],
//             },
//         },

//         // Typescript
//         {
//             files: ["**/*.{ts,tsx}"],
//             plugins: ["@typescript-eslint", "import"],
//             parser: "@typescript-eslint/parser",
//             settings: {
//                 "import/internal-regex": "^~/",
//                 "import/resolver": {
//                     node: {
//                         extensions: [".ts", ".tsx"],
//                     },
//                     typescript: {
//                         alwaysTryTypes: true,
//                     },
//                 },
//             },
//             extends: [
//                 "plugin:@typescript-eslint/recommended",
//                 "plugin:import/recommended",
//                 "plugin:import/typescript",
//             ],
//         },

//         // Node
//         {
//             files: [".eslintrc.js"],
//             env: {
//                 node: true,
//             },
//         },
//     ],
// };
