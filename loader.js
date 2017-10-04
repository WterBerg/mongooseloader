'use strict';

var mongoose = require('mongoose'),
    fs = require('fs');

var schemaSource = null,
    schemas = [],
    modelSource = null,
    models = [];

var loader = {};

loader.LoadSchemas = function(source) {
    if (!fs.existsSync(source)) {
        throw new Error('Given source does not exist.');
    }

    schemaSource = source;

    var schemaFiles = fs.readdirSync(source, {encoding: 'utf8'});

    schemaFiles.forEach(function(file) {
        loadRequiredSchemasAndSchema(file);
    });

    return schemas;
};
loader.LoadModels = function(source) {
    if (!fs.existsSync(source)) {
        throw new Error('Given source does not exist.');
    }

    modelSource = source;

    var modelFiles = fs.readdirSync(source, {encoding: 'utf8'});

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
