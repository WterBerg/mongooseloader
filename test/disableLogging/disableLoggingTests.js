'use strict';

const assert = require('assert'),
    loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        assert.ok(loader.hasOwnProperty('disableLogging'));
    },
    isFunction: () => {
        assert.ok(typeof loader.disableLogging === 'function');
    },
    shouldDisableLogging: () => {
        let loggingEnabled = false,
            logPlaceholder = console.log;

        console.log = () => {
            loggingEnabled = !loggingEnabled;
        };

        loader.enableLogging();
        loader.disableLogging();

        console.log = logPlaceholder;

        assert.equal(loggingEnabled, false);
    }
};
