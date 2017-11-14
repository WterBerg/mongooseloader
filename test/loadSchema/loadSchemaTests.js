'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    exists: async () => {
        assert.ok(loader.hasOwnProperty('loadSchema'));
    },
    isFunction: async () => {
        assert.ok(typeof loader.loadSchema === 'function');
    },
    throwsErrorOnNonJSFile: async () => {
        try {
            await loader.loadSchema('test.png');

            assert.fail('No error thrown');
        } catch (err) {
            assert.equal(err.message, 'file is not a javascript file');
        }
    },
    throwsErrorOnAlreadyExistingSchema: async () => {
        try {
            loader.setSchemaSource('./test/loadSchema/throwserroronalreadyexistingschema');
            await loader.loadSchema('MyDocument.js');
            await loader.loadSchema('MyDocument.js');

            assert.fail('no error thrown');
        } catch (err) {
            assert.equal(err.message, 'a schema already exists with name MyDocument');
        }
    },
    throwsErrorOnNonSchemaJavascriptFile: async () => {
        try {
            loader.setSchemaSource('./test/loadSchema/throwserroronnonschemajavascriptfile');
            await loader.loadSchema('MyInvalidDocument.js');

            assert.fail('No error thrown');
        } catch (err) {
            assert.equal(err.message, 'given schema is not a schema');
        }
    },
    loadValidSchemasIntoMongoose: async () => {
        try {
            loader.setSchemaSource('./test/loadSchema/loadvalidschemasintomongoose');
            let schemas = await loader.loadSchema('MyValidDocument.js');

            assert.ok(schemas['MyValidDocument']);
        } catch (err) {
            assert.fail(err.message);
        }
    },
    loadsRequiredSchemasBeforeActualSchema: async() => {
        try {
            loader.setSchemaSource('./test/loadSchema/loadsrequiredschemasbeforeactualschema');
            let schemas = await loader.loadSchema('MyDependingSchema.js');

            assert.ok(schemas['MyDependingSchema']);
            assert.ok(schemas['TheRequiredSchema']);
        } catch (err) {
            assert.fail(err.message);
        }
    }
};
