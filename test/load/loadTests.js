'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    loadExists: () => {
        return loader.hasOwnProperty('load');
    },
    loadIsFunction: () => {
        return typeof loader.load === 'function';
    },
    returnsModelsOnSuccess: async () => {
        let models = await loader.load(
            [
                './test/load/returnsmodelsuponsuccess/schemas',
                './test/load/returnsmodelsuponsuccess/models'
            ]
        );

        assert.ok(models['MyLoadDocument']);
    }
};
