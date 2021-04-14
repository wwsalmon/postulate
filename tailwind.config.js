const defaultTheme = require("tailwindcss/defaultTheme");

let t = {};
t["p"] = t["img"] = t["video"] = t["figure"] = {
    paddingTop: "0.75em",
    paddingBottom: "0.75em",
    marginTop: 0,
    marginBottom: 0,
}
t["ol"] = t["ul"] = {
    paddingTop: 0,
    paddingBottom: "0.75em",
    marginTop: 0,
    marginBottom: 0,
}
t["h1"] = t["h2"] = t["h3"] = t["h4"] = t["h5"] = t["h6"] = {
    paddingTop: "1.5em",
    paddingBottom: "0.75em",
    marginTop: 0,
    marginBottom: 0,
}

module.exports = {
    purge: [
        './**/*.html',
        './**/*.tsx',
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: [t, {
                        blockquote: {
                            fontStyle: "normal",
                            fontWeight: "400",
                            color: defaultTheme.colors.gray[400],
                            quotes: "",
                        }
                    }],
                }
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};