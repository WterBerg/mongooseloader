'use strict';

const assert = require('assert'),
      loader = require('../loader.js'),
      mongoose = require('mongoose');

let expected, actual;

describe('mongooseloader', () => {
    describe('loadSchemas(source, mongoose)', () => {
        it('Should return an empty array when no schemas are found', loadSchemasEmptyArrayOnEmptySource);
        it('Should throw an error when trying to load schemas from a invalid location', loadSchemasErrorOnInvalidSource);
        it('Should ignore non-javascript files found in the source directory.', loadSchemasIgnoresNonJavascriptFiles);
        it('Should ignore javascript files found that do not follow the schema template', loadSchemasIgnoresNonSchemaJavascriptFiles);
        it('Should load schema files into mongoose and return the schemas', loadSchemasloadsValidSchemas);
        it('Should correctly load the required schemas of a schema before loading that schema', loadSchemasloadsRequiredSchemasFirst);
        it('Should throw an error when trying to load schemas with circular references.', loadSchemasThrowsErrorOnCircularReferences);
    });
    describe('loadModels(source, mongoose)', () => {
        it('Should return an empty array when no models are found', loadModelsEmptyArrayOnEmptySource);
        it('Should throw an error when trying to load models from a invalid location', loadModelsErrorOnInvalidSource);
        it('Should ignore non-javascript files in the source directory', loadModelsIgnoresNonJavascriptFiles);
        it('Should throw an error when no schema is found that corresponds to the models', loadModelsThrowsErrorOnValidModelsWithoutASchema);
        it('Should load models into mongoose and return its constructor', loadModelsloadsValidModelsIntoMongoose);
    });
});

async function loadSchemasEmptyArrayOnEmptySource() {
    actual = await loader.loadSchemas('./test/schemas/dirempty', mongoose);
    expected = [];

    assert.deepEqual(actual, expected);
}

async function loadSchemasErrorOnInvalidSource() {
    loader.loadSchemas('./test/schemas/doesnotexist', mongoose)
        .catch((error) => {
            assert.ok(error.message.startsWith('Error: ENOENT: no such file or directory'));
        });
}

async function loadSchemasIgnoresNonJavascriptFiles() {
    actual = await loader.loadSchemas('./test/schemas/dirnonjs', mongoose);
    expected = [];

    assert.deepEqual(actual, expected);
}

async function loadSchemasIgnoresNonSchemaJavascriptFiles() {
    actual = await loader.loadSchemas('./test/schemas/dirnonschemajs', mongoose);
    expected = [];

    assert.deepEqual(actual, expected);
}

async function loadSchemasloadsValidSchemas() {
    actual = await loader.loadSchemas('./test/schemas/dirvalidschema', mongoose);

    assert.ok(actual['validSchema']);
}

async function loadSchemasloadsRequiredSchemasFirst() {
    actual = await loader.loadSchemas('./test/schemas/dirdependentschemas', mongoose);

    assert.ok(actual['dependingSchema']);
    assert.ok(actual['dependantSchema']);
}

async function loadSchemasThrowsErrorOnCircularReferences() {
    try {
        await loader.loadSchemas('./test/schemas/dircircularschema', mongoose);
    } catch (error) {
        assert.equal(error.message, 'RangeError: Maximum call stack size exceeded');
    }
}

async function loadModelsEmptyArrayOnEmptySource() {
    actual = await loader.loadModels('./test/models/dirempty', mongoose);
    expected = [];

    assert.deepEqual(actual, expected);
}

async function loadModelsErrorOnInvalidSource() {
    loader.loadSchemas('./test/models/doesnotexist', mongoose)
        .catch((error) => {
            assert.ok(error.message.startsWith('Error: ENOENT: no such file or directory'));
        });
}

async function loadModelsIgnoresNonJavascriptFiles() {
    actual = await loader.loadModels('./test/models/dirnonjs', mongoose);
    expected = [];

    assert.deepEqual(actual, expected);
}

async function loadModelsThrowsErrorOnValidModelsWithoutASchema() {
    try {
        await loader.loadModels('./test/models/dirmodelwithoutschema', mongoose);

        mongoose.model('validSchema');
    } catch (error) {
        assert.equal(error.name, 'MissingSchemaError');
    }
}

async function loadModelsloadsValidModelsIntoMongoose() {
    await loader.loadSchemas('./test/schemas/dirvalidschema', mongoose);
    await loader.loadModels('./test/models/dirvalidmodel', mongoose);

    assert.ok(mongoose.model('validSchema'));
}
