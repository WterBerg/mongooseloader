'use strict';

const assert = require('assert'),
      loader = require('../../mongooseloader.js');

module.exports = {
    exists: () => {
        assert.ok(loader.hasOwnProperty('loadModel'));
    },
    isFunction: () => {
        assert.ok(typeof loader.loadModel === 'function');
    },
    throwsErrorOnNonJSFile: async () => {
        try {
            await loader.loadModel('test.png');

            assert.fail('No error thrown');
        } catch (err) {
            assert.equal(err.message, 'file is not a javascript file');
        }
    },
    throwsErrorOnNonSchemaModel: async () => {
        try {
            await loader.loadModel('MyModel.js');

            assert.fail('No error thrown');
        } catch (err) {
            assert.equal(err.message, 'no corresponding schema found for model MyModel');
        }
    },
    throwsErrorOnAlreadyExistingModel: async () => {
        try {
            loader.setSchemaSource('./test/loadModel/throwserroronalreadyexistingmodel/schema');
            loader.setModelSource('./test/loadModel/throwserroronalreadyexistingmodel/model');

            await loader.loadSchema('MyModernDocument.js');
            await loader.loadModel('MyModernDocument.js');
            await loader.loadModel('MyModernDocument.js');

            assert.fail('no error thrown');
        } catch (err) {
            assert.equal(err.message, 'a model already exists with name MyModernDocument');
        }
    },
    throwsErrorOnNonModelJavascriptFile: async () => {
        try {
            loader.setSchemaSource('./test/loadModel/throwserroronnonmodeljavascriptfile/schema');
            loader.setModelSource('./test/loadModel/throwserroronnonmodeljavascriptfile/model');

            await loader.loadSchema('MyEnticingDocument.js');
            await loader.loadModel('MyEnticingDocument.js');

            assert.fail('no error thrown');
        } catch (err) {
            assert.equal(err.message, 'given model is not a model');
        }
    },
    loadValidModelIntoMongoose: async () => {
        try {
            loader.setSchemaSource('./test/loadModel/loadvalidmodelintomongoose/schema');
            loader.setModelSource('./test/loadModel/loadvalidmodelintomongoose/model');

            await loader.loadSchema('MyNiceDocument.js');
            let models = await loader.loadModel('MyNiceDocument.js');

            assert.ok(models['MyNiceDocument']);
        } catch (err) {
            assert.fail(err.message);
        }
    }
};
