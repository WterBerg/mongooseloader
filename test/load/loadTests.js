'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        assert.ok(loader.hasOwnProperty('load'));
    },
    isFunction: () => {
        assert.ok(typeof loader.load === 'function');
    },
    returnsModelsOnSuccess: async () => {
        try {
            let models = await loader.load(
                [
                    './test/load/returnsmodelsuponsuccess/schemas',
                    './test/load/returnsmodelsuponsuccess/models'
                ]
            );

            assert.ok(models['MyLoadDocument']);
        } catch (err) {
            assert.fail(err.message);
        }
    }
};
