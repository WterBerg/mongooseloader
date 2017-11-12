'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    exists: async () => {
        return loader.hasOwnProperty('loadSchema');
    },
    isFunction: async () => {
        return typeof loader.loadSchema === 'function';
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
        } catch (err) {
            assert.equal(err.message, 'a schema already exists with name MyDocument');
        }
    },
    throwsErrorOnNonSchemaJavascriptFile: async () => {
        try {
            loader.setSchemaSource('./test/loadSchema/throwserroronnonschemajavascriptfile');
            await loader.loadSchema('MyInvalidDocument.js');
        } catch (err) {
            assert.equal(err.message, 'given schema is not a schema');
        }
    },
    loadValidSchemasIntoMongoose: async () => {
        loader.setSchemaSource('./test/loadSchema/loadvalidschemasintomongoose');
        await loader.loadSchema('MyValidDocument.js');
    },
    loadsRequiredSchemasBeforeActualSchema: async() => {
        loader.setSchemaSource('./test/loadSchema/loadsrequiredschemasbeforeactualschema');
        let schemas = await loader.loadSchema('MyDependingSchema.js');

        assert.ok(schemas['MyDependingSchema']);
        assert.ok(schemas['TheRequiredSchema']);
    }
};
