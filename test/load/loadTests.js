'use strict';

const loader = require('../../mongooseloader.js');

module.exports = {
    loadExists: () => {
        return loader.hasOwnProperty('load');
    },
    loadIsFunction: () => {
        return typeof loader.load === 'function';
    }
};
