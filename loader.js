'use strict';

var fs = require('fs'),
    path = require('path');

var root = path.dirname(require.main.filename),
    options = {encoding: 'utf8'};

var schemaSource,
    schemas = [],
    modelSource,
    models = [];

module.exports = {
    LoadSchemas: loadSchemas,
    LoadModels: loadModels
};

function loadSchemas(source) {
    schemaSource = path.resolve(root, source);

    fs.readdirSync(schemaSource, options).forEach(function(file) {
        loadRequiredSchemasAndSchema(file);
    });

    return schemas;
}

function loadModels(source) {
    modelSource = path.resolve(root, source);

    fs.readdirSync(modelSource, options).forEach(function(file) {
        loadModel(file);
    });

    return models;
}

function loadRequiredSchemasAndSchema(schemaFile, mongoose) {
    var schema = require(path.resolve(schemaSource, schemaFile)),
        name = schemaFile.substr(0, schemaFile.indexOf('.'));

    if (schemas[name])
        return;

    schema.getRequiredSchemas().forEach(function(requiredSchema) {
        if (schemas[requiredSchema])
            return;

        loadRequiredSchemasAndSchema(requiredSchema + '.js');
    });

    schemas[name] =  schema.getSchema(mongoose, schemas);
}

function loadModel(modelFile, mongoose) {
    var name = modelFile.substr(0, modelFile.indexOf('.'));

    models[name] = require(path.resolve(modelSource, modelFile))(mongoose, schemas[name]);
}
