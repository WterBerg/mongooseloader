'use strict';

const loader = require('../../mongooseloader.js');

module.exports = {
    loadExists: () => {
        return loader.hasOwnProperty('loadModel');
    },
    loadIsFunction: () => {
        return typeof loader.loadModel === 'function';
    }
};
