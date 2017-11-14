'use strict';

describe('MongooseLoader', () => {

    describe('enableLogging()', () => {
        const enableLoggingTests = require('./enableLogging/enableLoggingTests.js');

        it('Should exist', enableLoggingTests.exists);
        it('Should be a function', enableLoggingTests.isFunction);
        it('Should enable logging', enableLoggingTests.shouldEnableLogging);
    });

    describe('disableLogging()', () => {
        const disableLoggingTests = require('./disableLogging/disableLoggingTests.js');

        it('Should exist', disableLoggingTests.exists);
        it('Should be a function', disableLoggingTests.isFunction);
        it('Should disable logging', disableLoggingTests.shouldDisableLogging);
    });

    describe('loadSchema(file)', () => {
        const loadSchemaTests = require('./loadSchema/loadSchemaTests.js');

        it('Should exist', loadSchemaTests.exists);
        it('Should be a function', loadSchemaTests.isFunction);
        it('Should throw an error on a non javascript file', loadSchemaTests.throwsErrorOnNonJSFile);
        it('Should throw an error on a already existing schema with a given name', loadSchemaTests.throwsErrorOnAlreadyExistingSchema);
        it('Should throw an error on a javascript file that is not a schema', loadSchemaTests.throwsErrorOnNonSchemaJavascriptFile);
        it('Should load a valid schema into mongoose', loadSchemaTests.loadValidSchemasIntoMongoose);
        it('Should ignore faulty required schemas', loadSchemaTests.ignoresFaultyRequiredSchemas);
        it('Should load required schemas before the actual schema', loadSchemaTests.loadsRequiredSchemasBeforeActualSchema);
    });

    describe('loadSchemas(source)', () => {
        const loadSchemasTests = require('./loadSchemas/loadSchemasTests.js');

        it('Should exist', loadSchemasTests.exists);
        it('Should be a function', loadSchemasTests.isFunction);
        it('Should ignore non-schemas found in the source', loadSchemasTests.ignoresNonSchemasFoundInSource);
        it('Should correctly load several schemas into mongoose', loadSchemasTests.correctlyLoadsDirIntoMongoose);
        it('Should throw an error on a non existing directory', loadSchemasTests.throwsErrorOnNonExistingDirectory);
    });

    describe('loadModel(file)', () => {
        const loadModelTests = require('./loadModel/loadModelTests.js');

        it('Should exist', loadModelTests.exists);
        it('Should be a function', loadModelTests.isFunction);
        it('Should throw an error on a non javascript file', loadModelTests.throwsErrorOnNonJSFile);
        it('Should throw an error when no corresponding schema is defined', loadModelTests.throwsErrorOnNonSchemaModel);
        it('Should throw an error if a model already exists with that name', loadModelTests.throwsErrorOnAlreadyExistingModel);
        it('Should throw an error is the given model is not a model', loadModelTests.throwsErrorOnNonModelJavascriptFile);
        it('Should load a valid model into mongoose', loadModelTests.loadValidModelIntoMongoose);
    });

    describe('loadModels(source)', () => {
        const loadModelsTests = require('./loadModels/loadModelsTests.js');

        it('Should exist', loadModelsTests.exists);
        it('Should be a function', loadModelsTests.isFunction);
        it('Should ignore non-models found in the source', loadModelsTests.ignoresNonModelsFoundInSource);
        it('Should correctly load several models into mongoose', loadModelsTests.correctlyLoadsDirIntoMongoose);
        it('Should throw an error on a non existing directory', loadModelsTests.throwsErrorOnNonExistingDirectory);
    });

    describe('load(sources)', () => {
        const loadTests = require('./load/loadTests.js');

        it('Should exist', loadTests.exists);
        it('Should be a function', loadTests.isFunction);
        it('Should return a list of models upon success', loadTests.returnsModelsOnSuccess);
    });

});
