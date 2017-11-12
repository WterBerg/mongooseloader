'use strict';

const loader = require('../../mongooseloader.js');

module.exports = {
    loadExists: () => {
        return loader.hasOwnProperty('loadModels');
    },
    loadIsFunction: () => {
        return typeof loader.loadModels === 'function';
    }
};
