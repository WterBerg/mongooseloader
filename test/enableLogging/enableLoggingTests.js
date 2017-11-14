'use strict';

const assert = require('assert'),
    loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        assert.ok(loader.hasOwnProperty('enableLogging'));
    },
    isFunction: () => {
        assert.ok(typeof loader.enableLogging === 'function');
    },
    shouldEnableLogging: () => {
        let loggingEnabled = false,
            logPlaceholder = console.log;

        console.log = () => {
            loggingEnabled = true;
        };

        loader.enableLogging();

        assert.ok(loggingEnabled);

        loader.disableLogging();
        console.log = logPlaceholder;
    }
};
