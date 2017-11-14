'use strict';

let loadSchemaTests = require('./loadSchema/loadSchemaTests.js'),
    loadSchemasTests = require('./loadSchemas/loadSchemasTests.js'),
    loadModelTests = require('./loadModel/loadModelTests.js'),
    loadModelsTests = require('./loadModels/loadModelsTests.js'),
    loadTests = require('./load/loadTests.js');

describe('MongooseLoader', () => {

    describe('loadSchema(file)', () => {
        it('Should exist', loadSchemaTests.exists);
        it('Should be a function', loadSchemaTests.isFunction);
        it('Should throw an error on a non javascript file', loadSchemaTests.throwsErrorOnNonJSFile);
        it('Should throw an error on a already existing schema with a given name', loadSchemaTests.throwsErrorOnAlreadyExistingSchema);
        it('Should throw an error on a javascript file that is not a schema', loadSchemaTests.throwsErrorOnNonSchemaJavascriptFile);
        it('Should load a valid schema into mongoose', loadSchemaTests.loadValidSchemasIntoMongoose);
        it('Should load required schemas before the actual schema', loadSchemaTests.loadsRequiredSchemasBeforeActualSchema);
    });

    describe('loadSchemas(source)', () => {
        it('Should exist', loadSchemasTests.exists);
        it('Should be a function', loadSchemasTests.isFunction);
        it('Should correctly load several schemas into mongoose', loadSchemasTests.correctlyLoadsDirIntoMongoose);
        it('Should throw an error on a non existing directory', loadSchemasTests.throwsErrorOnNonExistingDirectory);
    });

    describe('loadModel(file)', () => {
        it('Should exist', loadModelTests.loadExists);
        it('Should be a function', loadModelTests.loadIsFunction);
        it('Should throw an error on a non javascript file', loadModelTests.throwsErrorOnNonJSFile);
        it('Should throw an error when no corresponding schema is defined', loadModelTests.throwsErrorOnNonSchemaModel);
        it('Should throw an error if a model already exists with that name', loadModelTests.throwsErrorOnAlreadyExistingModel);
        it('Should throw an error is the given model is not a model', loadModelTests.throwsErrorOnNonModelJavascriptFile);
        it('Should load a valid model into mongoose', loadModelTests.loadValidModelIntoMongoose);
    });

    describe('loadModels(source)', () => {
        it('Should exist', loadModelsTests.loadExists);
        it('Should be a function', loadModelsTests.loadIsFunction);
        it('Should correctly load several models into mongoose', loadModelsTests.correctlyLoadsDirIntoMongoose);
        it('Should throw an error on a non existing directory', loadModelsTests.throwsErrorOnNonExistingDirectory);
    });

    describe('load(sources)', () => {
        it('Should exist', loadTests.loadExists);
        it('Should be a function', loadTests.loadIsFunction);
        it('Should return a list of models upon success', loadTests.returnsModelsOnSuccess);
    });

});
