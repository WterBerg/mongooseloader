'use strict';

const loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        return loader.hasOwnProperty('loadSchemas');
    },
    isFunction: () => {
        return typeof loader.loadSchemas === 'function';
    }
};
