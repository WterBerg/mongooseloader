'use strict';

const fs = require('fs'),
      path = require('path'),
      mongoose = require('mongoose');

let schemas = {},
    schemaSource = undefined,
    models = {},
    modelSource = undefined,
    enableLogging = false;

class MongooseLoader {

    /**
     * Sets the schemaSource, use this when loading individual schemas with loadSchema().
     *
     * @param source the source of the schemas
     */
    static setSchemaSource(source) {
        schemaSource = path.resolve(process.cwd(), source);
    }

    /**
     * sets the modelSource, use this when loading individual models with loadModel().
     *
     * @param source the source of the models
     */
    static setModelSource(source) {
        modelSource = path.resolve(process.cwd(), source);
    }

    /**
     * Enables MongooseLoader to log details into console.log
     */
    static enableLogging() {
        enableLogging = true;
        log('logging enabled.');
    }

    /**
     * Disables all logging. Logging is disabled by default.
     */
    static disableLogging() {
        log('logging disabled.');
        enableLogging = false;
    }

    /**
     * Convenience method to call both loadSchemas and loadModels. Returns a Promise indicating that mongoose contains the defined models, or an error indicating what went wrong.
     *
     * Note: call enableLogging() to get a detailed overview if you encounter problems.
     *
     * @param sources an array containing the sources of schemas and models, respectively.
     */
    static async load(sources) {
        await MongooseLoader.loadSchemas(sources[0]);

        return await MongooseLoader.loadModels(sources[1]);
    }

    /**
     * Loads all the schemas found in the given directory into mongoose and returns them as a Promise.
     *
     * The Promise will reject if an error occurs while reading the directory, or if the given source is not a directory.
     *
     * Note: call enableLogging() to get a detailed overview if you encounter problems.
     *
     * @param source A String containing the source of the schemas
     * @returns {Promise.<{}>} Returns a Promise that resolves with an array of all the schemas loaded, or an error message detailing what went wrong.
     */
    static async loadSchemas(source) {
        try {
            schemaSource = path.resolve(process.cwd(), source);
            log(`[loadSchemas] schema source resolved to ${schemaSource}`);

            let files = await readDir(schemaSource);
            log(`[loadSchemas] schema source read, found files [${files}]`);

            for (let file of files) {
                try {
                    await MongooseLoader.loadSchema(file);
                } catch (err) {
                    log(`[loadSchemas] ignoring ${file}; ${err}`);
                }
            }

            return schemas;
        } catch (err) {
            log(`[loadSchemas] error while reading ${schemaSource}; ${err}`);
            throw err;
        }
    }

    /**
     * Loads the schema found in the given file into mongoose and its required schemas into mongoose and returns the original schema as a Promise.
     *
     * The returned Promise rejects if
     * - The file does not have the '.js' extension
     * - A schema is already defined with that name
     * - If the file does not contain a mongoose schema
     *
     * Note: call enableLogging() to get a detailed overview if you encounter problems.
     *
     * @param file A filename relative to the schemaSource to load as a schema.
     * @returns {Promise.<*>} Returns a Promise that resolves with the given schema, or rejects with a detailed error message.
     */
    static async loadSchema(file) {
        log(`[loadSchema] loading ${file}`);

        if (file.substr(-3) !== '.js')
            throw new Error('file is not a javascript file');

        let name = file.substr(0, file.indexOf('.'));
        log(`[loadSchema] schema name resolved to ${name}`);

        if (schemas[name])
            throw new Error('a schema already exists with name ' + name);

        let schema = require(path.resolve(schemaSource, file));

        if (!isSchema(schema))
            throw new Error('given schema is not a schema');

        for (let requiredSchema of schema.getRequiredSchemas()) {
            try {
                await MongooseLoader.loadSchema(requiredSchema + '.js');
            } catch (err) {
                log(`[loadSchemas] ignoring ${requiredSchema}; ${err}`);
            }
        }

        schemas[name] = schema.getSchema(mongoose, schemas);
        log(`[loadSchema] loaded schema ${name} into mongoose`);

        return schemas;
    }

    /**
     * Loads all the models found in the given directory into mongoose and returns them as a Promise.
     *
     * The Promise will reject if an error occurs while reading the directory, or if the given source is not a directory.
     *
     * Note: call enableLogging() to get a detailed overview if you encounter problems.
     *
     * @param source A String containing the source of the models
     * @returns {Promise.<{}>} Returns a Promise that resolves with an array of all the models loaded, or an error message detailing what went wrong.
     */
    static async loadModels(source) {
        try {
            modelSource = path.resolve(process.cwd(), source);
            log(`[loadModels] model source resolved to ${modelSource}`);

            let files = await readDir(modelSource);
            log(`[loadModels] model source read, found files [${files}]`);

            for (let file of files) {
                try {
                    await MongooseLoader.loadModel(file);
                } catch (err) {
                    log(`[loadModels] ignoring ${file}; ${err}`);
                }
            }

            return models;
        } catch (err) {
            log(`[loadModels] error while reading ${modelSource}; ${err}`);
            throw err;
        }
    }

    /**
     * Loads the model found in the given file into mongoose and returns the model in a Promise.
     *
     * The returned Promise rejects if
     * - The file does not have the '.js' extension
     * - There is no schema that corresponds to the given model
     * - There already is a model with the given name
     * - The contents of the file is not a model
     *
     * Note: call enableLogging() to get a detailed overview if you encounter problems.
     *
     * @param file A filename relative to the modelSource to load as a schema.
     * @returns {Promise.<*>} Returns a Promise that resolves with the given model, or rejects with a detailed error message.
     */
    static async loadModel(file) {
        log(`[loadModel] loading ${file}`);

        if (file.substr(-3) !== '.js')
            throw new Error('file is not a javascript file');

        let name = file.substr(0, file.indexOf('.'));
        log(`[loadModel] model name resolved to ${name}`);

        if (!schemas[name])
            throw new Error('no corresponding schema found for model ' + name);

        if (models[name])
            throw new Error('a model already exists with name ' + name);

        let model = require(path.resolve(modelSource, file));

        if (!isModel(model))
            throw new Error('given model is not a model');

        models[name] = model(mongoose, schemas[name]);
        log(`[loadModel] loaded model ${name} into mongoose`);

        return models;
    }

}

module.exports = MongooseLoader;

function readDir(source) {
    return new Promise((resolve, reject) => {
        fs.readdir(source, { encoding: 'utf8' }, (err, files) => {
            if (err)
                reject(err);

            resolve(files);
        });
    });
}

function isSchema(schema) {
    return schema.hasOwnProperty('getRequiredSchemas') && schema.hasOwnProperty('getSchema');
}

function isModel(model) {
    return typeof model === 'function';
}

function log(message) {
    if (!enableLogging)
        return;

    console.log('[MongooseLoader] ' + message);
}
