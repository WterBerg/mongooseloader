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
    });

    describe('loadModels(source)', () => {
        it('Should exist', loadModelsTests.loadExists);
        it('Should be a function', loadModelsTests.loadIsFunction);
    });

    describe('load(sources)', () => {
        it('Should exist', loadTests.loadExists);
        it('Should be a function', loadTests.loadIsFunction);
    });

});
