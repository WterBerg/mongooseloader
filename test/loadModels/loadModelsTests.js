'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    loadExists: () => {
        assert.ok(loader.hasOwnProperty('loadModels'));
    },
    loadIsFunction: () => {
        assert.ok(typeof loader.loadModels === 'function');
    },
    correctlyLoadsDirIntoMongoose: async () => {
        try {
            await loader.loadSchemas('./test/loadModels/correctlyloadsdirintomongoose/schemas');
            let models = await loader.loadModels('./test/loadModels/correctlyloadsdirintomongoose/models');

            assert.ok(models['MySuperValidDocument']);
            assert.ok(models['SomeValidDocument']);
        } catch (err) {
            assert.fail(err.message);
        }
    },
    throwsErrorOnNonExistingDirectory: async () => {
        try {
            await loader.loadModels('This/Does/Not/Exist');

            assert.fail('No error thrown');
        } catch (err) {
            assert.ok(err.message.startsWith('ENOENT: no such file or directory'));
        }
    }
};
