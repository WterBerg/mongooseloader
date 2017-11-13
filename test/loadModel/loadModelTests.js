'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    loadExists: () => {
        return loader.hasOwnProperty('loadModel');
    },
    loadIsFunction: () => {
        return typeof loader.loadModel === 'function';
    },
    throwsErrorOnNonJSFile: async () => {
        try {
            await loader.loadModel('test.png');
            assert.fail('No error thrown');
        } catch (err) {
            assert.equal(err.message, 'file is not a javascript file');
        }
    },
    throwsErrorOnNonSchemaModel: async () => {
        try {
            await loader.loadModel('MyModel.js');
            assert.fail('No error thrown');
        } catch (err) {
            assert.equal(err.message, 'no corresponding schema found for model MyModel');
        }
    }
};
