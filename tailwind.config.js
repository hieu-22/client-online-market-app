/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            // breakpoint
            screens: {
                phone: "360px",
                tablet: "640px",
                // => @media (min-width: 640px) { ... }

                laptop: "1024px",
                // => @media (min-width: 1024px) { ... }

                desktop: "1280px",
                // => @media (min-width: 1280px) { ... }
            },
            height: {
                outlet: "calc(100% - 140px);",
            },
            width: {
                desktop: "1280px",
                laptop: "1024px",
                "1/12": "8.33%",
                "2/12": "16.66%",
                "3/12": "25%",
                "4/12": "33.33%",
                "5/12": "41.66%",
                "6/12": "50%",
                "7/12": "58.33%",
                "8/12": "66.66%",
                "9/12": "75%",
                "10/12": "83.33%",
                "11/12": "91.66%",
                "12/12": "100%",
            },
            maxWidth: {
                "1/12": "8.33%",
                "2/12": "16.66%",
                "3/12": "25%",
                "4/12": "33.33%",
                "5/12": "41.66%",
                "6/12": "50%",
                "7/12": "58.33%",
                "8/12": "66.66%",
                "9/12": "75%",
                "10/12": "83.33%",
                "11/12": "91.66%",
                "12/12": "100%",
            },
            minWidth: {
                "1/12": "8.33%",
                "2/12": "16.66%",
                "3/12": "25%",
                "4/12": "33.33%",
                "5/12": "41.66%",
                "6/12": "50%",
                "7/12": "58.33%",
                "8/12": "66.66%",
                "9/12": "75%",
                "10/12": "83.33%",
                "11/12": "91.66%",
                "12/12": "100%",
            },
            colors: {
                primary: "#00a5e7",
                "light-primary": "#43b9e9",
                "hover-primary": "rgb(212 243 255)",
                background: "#c9dfef",

                customBlack: "rgb(23 23 23)",
                customWhite: "rgb(239 246 255)",
                "black-0.1": "rgb(0 0 0 / 10%)",
                "black-0.5": "rgb(0 0 0 / 50%)",
                "white-0.4": "rgb(255 255 255 / 40%)",
                0: "rgb(255 255 255 / 0)",
            },
            userSelect: {
                text: "text",
                none: "none",
                auto: "auto",
            },
            boxShadow: {
                boxMd: "0 0px 4px 1px rgb(0 0 0 / 0.1)",
                big: "0 0px 6px 2px rgb(0 0 0 / 0.2)",
            },
            fontSize: {
                "2xs": "0.65rem",
            },
        },
    },
    plugins: [],
}
