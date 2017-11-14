'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        assert.ok(loader.hasOwnProperty('loadSchemas'));
    },
    isFunction: () => {
        assert.ok(typeof loader.loadSchemas === 'function');
    },
    ignoresNonSchemasFoundInSource: async () => {
        try {
            await loader.loadSchemas('./test/loadSchemas/ignoresnonschemasfoundinsource');
        } catch (err) {
            assert.fail(err.message);
        }
    },
    correctlyLoadsDirIntoMongoose: async () => {
        try {
            let schemas = await loader.loadSchemas('./test/loadSchemas/correctlyloadsdirintomongoose');

            assert.ok(schemas['MyVeryValidDocument']);
            assert.ok(schemas['AnotherValidDocument']);
        } catch (err) {
            assert.fail(err.message);
        }
    },
    throwsErrorOnNonExistingDirectory: async () => {
        try {
            await loader.loadSchemas('This/Does/Not/Exist');

            assert.fail('No error thrown');
        } catch (err) {
            assert.ok(err.message.startsWith('ENOENT: no such file or directory'));
        }
    }
};
