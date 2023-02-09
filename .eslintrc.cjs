module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    env: {
        node: true,
        browser: false,
    },
    "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "semi": [2, "always"]
    }
};