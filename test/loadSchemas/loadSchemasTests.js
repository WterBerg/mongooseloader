'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        return loader.hasOwnProperty('loadSchemas');
    },
    isFunction: () => {
        return typeof loader.loadSchemas === 'function';
    },
    correctlyLoadsDirIntoMongoose: async () => {
        let schemas = await loader.loadSchemas('./test/loadSchemas/correctlyloadsdirintomongoose');

        assert.ok(schemas['MyVeryValidDocument']);
        assert.ok(schemas['AnotherValidDocument']);
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
