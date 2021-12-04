module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'standard/no-callback-literal': 'off',
        '@typescript-eslint/explicit-module-boundary-types': ['error', {
            allowArgumentsExplicitlyTypedAsAny: true,
        }],
        indent: ['error', 4, {
            SwitchCase: 1
        }],
        semi: ['error', 'always'],
        'eol-last': ['error', 'always'],
        'padded-blocks': ['error', {
            classes: 'always',
            switches: 'always'
        }],
        'comma-dangle': ['error', 'only-multiline'],
        'brace-style': ['error', 'stroustrup'],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always'
        }],
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4]
    }
};
