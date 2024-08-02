// translations.js
const i18next = require('i18next');
// ... other i18next configurations

const translate = (key, options) => {
    return i18next.t(key, options);
};

module.exports = translate;
