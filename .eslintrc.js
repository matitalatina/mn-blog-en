module.exports = {
    "extends": [
        "react-app"
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "rules": {
        "react/no-unknown-property": ["error", { "ignore": ["css"] }],
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "react/no-unescaped-entities": "error"
    }
};
