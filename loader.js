'use strict';

var mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path');

var root = path.dirname(require.main.filename);

var schemaSource = null,
    schemas = [],
    modelSource = null,
    models = [];

var loader = {};

loader.LoadSchemas = function(source) {
    schemaSource = path.resolve(root, source);

    if (!fs.existsSync(schemaSource)) {
        throw new Error('Given source does not exist.');
    }

    var schemaFiles = fs.readdirSync(schemaSource, {encoding: 'utf8'});

    schemaFiles.forEach(function(file) {
        loadRequiredSchemasAndSchema(file);
    });

    return schemas;
};
loader.LoadModels = function(source) {
    modelSource = path.resolve(root, source);

    if (!fs.existsSync(modelSource)) {
        throw new Error('Given source does not exist.');
    }

    var modelFiles = fs.readdirSync(modelSource, {encoding: 'utf8'});

    modelFiles.forEach(function(file) {
        loadModel(file);
    });

    return models;
};

module.exports = loader;

function loadRequiredSchemasAndSchema(schemaFile) {
    var file = require(schemaSource + '/' + schemaFile),
        name = schemaFile.substr(0, schemaFile.indexOf('.'));

    if (schemas[name])
        return;

    var requiredSchemas = file.getRequiredSchemas();

    requiredSchemas.forEach(function(schema) {
        if (schemas[schema])
            return;

        loadRequiredSchemasAndSchema(schema + '.js');
    });

    schemas[name] =  file.getSchema(mongoose, schemas);
}

function loadModel(modelFile) {
    var name = modelFile.substr(0, modelFile.indexOf('.'));

    models[name] = require(modelSource + '/' + modelFile)(mongoose, schemas[name]);
}
