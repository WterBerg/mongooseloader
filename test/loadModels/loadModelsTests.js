'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    loadExists: () => {
        return loader.hasOwnProperty('loadModels');
    },
    loadIsFunction: () => {
        return typeof loader.loadModels === 'function';
    },
    correctlyLoadsDirIntoMongoose: async () => {
        await loader.loadSchemas('./test/loadModels/correctlyloadsdirintomongoose/schemas');
        let models = await loader.loadModels('./test/loadModels/correctlyloadsdirintomongoose/models');

        assert.ok(models['MySuperValidDocument']);
        assert.ok(models['SomeValidDocument']);
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
