module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "vue/no-v-model-argument": "off",
        "vue/multi-word-component-names": "off",
        "no-unused-vars": "off",
        "vue/no-v-for-template-key": "off"
}
};
