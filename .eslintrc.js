module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/no-for-in-array": "error",
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "constructor-super": "error",
        "curly": "error",
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-caller": "error",
        "no-debugger": "error",
        "no-duplicate-case": "error",
        "no-eval": "error",
        "no-new-wrappers": "error",
        "no-redeclare": "error",
        "no-sparse-arrays": "error",
        "no-throw-literal": "error",
        "no-unsafe-finally": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-var": "error",
    }
};
