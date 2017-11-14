'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        assert.ok(loader.hasOwnProperty('loadModels'));
    },
    isFunction: () => {
        assert.ok(typeof loader.loadModels === 'function');
    },
    ignoresNonModelsFoundInSource: async () => {
        try {
            await loader.loadModels('./test/loadModels/ignoresnonmodelsfoundinsource');
        } catch (err) {
            assert.fail(err.message);
        }
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
