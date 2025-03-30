import primeui from 'tailwindcss-primeui'
import {addDynamicIconSelectors} from "./tailwind-iconify";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/@mergehez/**/*.{css,js}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        primeui,
        addDynamicIconSelectors({
            prefix: 'icon',
            overrideOnly: true,
            scale: 1,
            iconSets: {},
            customise: (content, name, prefix) => content,
        }),
    ],
}

