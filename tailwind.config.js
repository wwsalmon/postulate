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

t["blockquote"] = {
    fontStyle: "normal",
    fontWeight: "400",
    color: defaultTheme.colors.gray[400],
    quotes: "",
};

module.exports = {
    purge: [
        './**/*.html',
        './**/*.tsx',
    ],
    theme: {
        extend: {
            colors: {
                upBlue: {
                    500: "#0026ff",
                }
            },
            typography(theme) {
                return {
                    DEFAULT: {
                        css: t,
                    },
                    dark: {
                        css: [t, {
                            color: theme("colors.gray.100"),
                            '[class~="lead"]': { color: theme("colors.gray.400") },
                            a: { color: theme("colors.gray.100") },
                            strong: { color: theme("colors.gray.100") },
                            hr: { borderColor: theme("colors.gray.800") },
                            blockquote: {
                                color: theme("colors.gray.100"),
                                borderLeftColor: theme("colors.gray.800"),
                            },
                            h1: { color: theme("colors.gray.100") },
                            h2: { color: theme("colors.gray.100") },
                            h3: { color: theme("colors.gray.100") },
                            h4: { color: theme("colors.gray.100") },
                            code: { color: theme("colors.gray.100") },
                            "a code": { color: theme("colors.gray.100") },
                            pre: {
                                color: theme("colors.gray.200"),
                                backgroundColor: theme("colors.gray.800"),
                            },
                            thead: {
                                color: theme("colors.gray.100"),
                                borderBottomColor: theme("colors.gray.700"),
                            },
                            "tbody tr": { borderBottomColor: theme("colors.gray.800") },
                        }],
                    },
                };
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};