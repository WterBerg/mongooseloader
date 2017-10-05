'use strict';

var proxyquire = require('proxyquire'),
    assert = require('assert'),
    mongoose = require('mongoose');

var loader,
    stubFs = {},
    stubPath = {};

describe('mongooseloader', function() {
   describe('LoadSchemas()', function() {
       it('should return an empty array when no schemas are found', noSchemas);
       it('should throw an error when trying to load schemas from a invalid location', invalidSchemaLocation);
       it('should ignore non-javascript files found in the source directory.', containsNonJavascriptFiles);
       it('should throw an error when javascript files found do not follow the schema template', throwsErrorOnInvalidSchemas);
       it('should load schema files into mongoose and return the schemas', loadsSchemasIntoMongoose);
       it('should correctly load the required schemas of a schema before loading that schema', loadRequiredBeforeSchema);
       it('should not load schemas that are already loaded', duplicateSchemas);
       it('should throw an error when trying to load schemas with circular references.', circularReferenceSchemas);
   });
   describe('LoadModels()', function() {
       it('should return an empty array when no models are found', noModels);
   });
});

function noSchemas() {
    stubPath.resolve = function() {
        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function() {
        return [];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.deepEqual(loader.LoadSchemas('./schema', mongoose), []);
}

function invalidSchemaLocation() {
    stubPath.resolve = function() {
        return './a/path/that/does/not/exist';
    };
    loader = proxyquire('../loader.js', {'path': stubPath});

    assert.throws(function() {loader.LoadSchemas('./schema')}, Error);
}

function containsNonJavascriptFiles() {
    stubPath.resolve = function() {
        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function() {
        return ['image.png'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.deepEqual(loader.LoadSchemas('./schema', mongoose), []);
}

function throwsErrorOnInvalidSchemas() {
    stubPath.resolve = function(source, file) {
        if ('nonSchema.js' === file)
            return './test/testfiles/schema/nonSchema.js';

        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function() {
        return ['nonSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.throws(function() {loader.LoadSchemas('./schema')}, Error);
}

function loadsSchemasIntoMongoose() {
    stubPath.resolve = function(source, file) {
        if ('validSchema.js' === file)
            return  './test/testfiles/schema/validSchema.js';

        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function() {
        return ['validSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert(loader.LoadSchemas('./schema', mongoose)['validSchema'] !== undefined);
}

function loadRequiredBeforeSchema() {
    stubPath.resolve = function(source, file) {
        if ('dependantSchema.js' === file)
            return  './test/testfiles/schema/dependantSchema.js';

        if ('dependingSchema.js' === file)
            return  './test/testfiles/schema/dependingSchema.js';

        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function() {
        return ['dependingSchema.js', 'dependantSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    var output = loader.LoadSchemas('./schema', mongoose);
    var expected = {'dependingSchema': {}, 'dependantSchema': {}};

    assert(output, expected);
}

function duplicateSchemas() {
    stubPath.resolve = function(source, file) {
        if ('dependantSchema.js' === file)
            return  './test/testfiles/schema/dependantSchema.js';

        if ('dependingSchema.js' === file)
            return  './test/testfiles/schema/dependingSchema.js';

        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function() {
        return ['dependingSchema.js', 'dependingSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    var output = loader.LoadSchemas('./schema', mongoose);
    var expected = {'dependingSchema': {}};

    assert(output, expected);
}

function circularReferenceSchemas() {
    stubPath.resolve = function(source, file) {
        if ('circularSchema.js' === file)
            return  './test/testfiles/schema/circularSchema.js';

        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function() {
        return ['circularSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.throws(function() {loader.LoadSchemas('./schema', mongoose)}, Error);
}

function noModels() {
    stubPath.resolve = function() {
        return './testfiles/model';
    };
    stubFs.readdirSync = function() {
        return [];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.deepEqual(loader.LoadSchemas('./model', mongoose), []);
}
