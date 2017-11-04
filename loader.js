'use strict';

const fs = require('fs'),
      path = require('path');

let root = process.cwd(),
    fileReaderOptions = {
        encoding: 'utf8'
    },
    schemas = {};

module.exports = {
    loadSchemas: async (source, mongoose) => {
        try {
            source = path.resolve(root, source);

            let schemaFiles = await readDir(source);

            schemaFiles.forEach((file) => {
                loadSchema(file, source, mongoose);
            });

            return schemas;
        } catch (error) {
            throw new Error(error);
        }
    },
    loadModels: async (source, mongoose) => {
        try {
            source = path.resolve(root, source);

            let modelFiles = await readDir(source),
                models = {};

            modelFiles.forEach((file) => {
                loadModel(file, source, mongoose, models);
            });

            return models;
        } catch (error) {
            throw new Error(error);
        }
    }
};

function readDir(source) {
    return new Promise((resolve, reject) => {
        fs.readdir(source, fileReaderOptions, (err, files) => {
            if (err) reject(err);

            resolve(files);
        });
    });
}

function loadSchema(file, source, mongoose) {
    if (file.substr(-3) !== '.js')
        return;

    let name = file.substr(0, file.indexOf('.'));
    let schema = require(path.resolve(source, file));

    if (schemas[name])
        return;

    if (isNotASchema(schema))
        return;

    schema.getRequiredSchemas().forEach((schema) => {
        loadSchema(schema + '.js', source, mongoose);
    });

    schemas[name] = schema.getSchema(mongoose, schemas);
}

function loadModel(file, source, mongoose, models) {
    if (file.substr(-3) !== '.js')
        return;

    let name = file.substr(0, file.indexOf('.'));
    let model = require(path.resolve(source, file));

    if (!schemas[name])
        return;

    if (isNotAModel(model))
        return model;

    if (typeof model !== 'function')
        return;

    models[name] = model(mongoose, schemas[name]);
}

function isNotASchema(schema) {
    let requiredFunctions = ['getRequiredSchemas', 'getSchema'],
        missing = false;

    requiredFunctions.map((requiredFunction) => {
        if (!schema.hasOwnProperty(requiredFunction))
            return missing = true;

        if (typeof schema[requiredFunction] !== 'function')
            return missing = true;
    });

    return missing;
}

function isNotAModel(model) {
    return typeof model !== 'function';
}
