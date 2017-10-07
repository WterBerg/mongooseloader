'use strict';

var proxyquire = require('proxyquire'),
    assert = require('assert');

var loader, stubFs, stubPath, mongoose;

beforeEach(function() {
    loader = undefined;
    stubFs = {};
    stubPath = {};
    mongoose = require('mongoose');
});

afterEach(function() {
    delete require.cache[require.resolve('mongoose')];
});

describe('mongooseloader', function() {
    describe('LoadSchemas()', function() {
        it('should return an empty array when no schemas are found', LoadSchemasEmptyArrayOnEmptySource);
        it('should throw an error when trying to load schemas from a invalid location', LoadSchemasErrorOnInvalidSource);
        it('should ignore non-javascript files found in the source directory.', LoadSchemasIgnoresNonJavascriptFiles);
        it('should throw an error when javascript files found do not follow the schema template', LoadSchemasErrorOnInvalidSchemas);
        it('should load schema files into mongoose and return the schemas', LoadSchemasLoadsValidSchemas);
        it('should correctly load the required schemas of a schema before loading that schema', LoadSchemasLoadsRequiredSchemasFirst);
        it('should not load schemas that are already loaded', LoadSchemasIgnoresDuplicateSchemas);
        it('should throw an error when trying to load schemas with circular references.', LoadSchemasThrowsErrorOnCircularReferences);
    });
    describe('LoadModels()', function() {
        it('should return an empty array when no models are found', LoadModelsEmptyArrayOnEmptySource);
        it('should throw an error when trying to load models from a invalid location', LoadModelsErrorOnInvalidSource);
        it('should ignore non-javascript files in the source directory', LoadModelsIgnoresNonJavascriptFiles);
        it('should throw an error when javascript files found do not follow the model template', LoadModelsThrowsErrorOnInvalidModels);
        it('should throw an error when no schema is found that corresponds to the model', LoadModelsThrowsErrorOnValidModelsWithoutASchema);
        it('should load models into mongoose and return its constructor', LoadModelsLoadsValidModelsIntoMongoose);
    });
});

function LoadSchemasEmptyArrayOnEmptySource() {
    stubFs.readdirSync = function() {
        return [];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs});

    assert.deepEqual(
        loader.LoadSchemas('./schema', mongoose),
        []
    );
}

function LoadSchemasErrorOnInvalidSource() {
    stubFs.readdirSync = function() {
        throw new Error();
    };
    loader = proxyquire('../loader.js', {'fs': stubFs});

    assert.throws(
        function() {
            loader.LoadSchemas('./schema', mongoose)
        },
        Error
    );
}

function LoadSchemasIgnoresNonJavascriptFiles() {
    stubFs.readdirSync = function() {
        return ['image.png'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs});

    assert.deepEqual(
        loader.LoadSchemas('./schema', mongoose),
        []
    );
}

function LoadSchemasErrorOnInvalidSchemas() {
    stubPath.resolve = function() {
        return './test/testfiles/schema/nonSchema.js';
    };
    stubFs.readdirSync = function() {
        return ['nonSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.throws(
        function() {
            loader.LoadSchemas('./schema', mongoose)
        },
        Error
    );
}

function LoadSchemasLoadsValidSchemas() {
    stubPath.resolve = function() {
        return  './test/testfiles/schema/validSchema.js';
    };
    stubFs.readdirSync = function() {
        return ['validSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.notEqual(
        loader.LoadSchemas('./schema', mongoose)['validSchema'],
        undefined
    );
}

function LoadSchemasLoadsRequiredSchemasFirst() {
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

    assert.notEqual(
        output['dependingSchema'],
        undefined
    );
    assert.notEqual(
        output['dependantSchema'],
        undefined
    );
}

function LoadSchemasIgnoresDuplicateSchemas() {
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
    assert.equal(
        Object.keys(output).length,
        1
    );
}

function LoadSchemasThrowsErrorOnCircularReferences() {
    stubPath.resolve = function(source, file) {
        return  './test/testfiles/schema/circularSchema.js';
    };
    stubFs.readdirSync = function() {
        return ['circularSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.throws(
        function() {
            loader.LoadSchemas('./schema', mongoose)
        },
        Error
    );
}

function LoadModelsEmptyArrayOnEmptySource() {
    stubFs.readdirSync = function() {
        return [];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs});

    assert.deepEqual(
        loader.LoadSchemas('./model', mongoose),
        []
    );
}

function LoadModelsErrorOnInvalidSource() {
    stubFs.readdirSync = function() {
        throw new Error();
    };
    loader = proxyquire('../loader.js', {'fs': stubFs});

    assert.throws(
        function() {
            loader.LoadModels('./model', mongoose)
        },
        Error
    );
}

function LoadModelsIgnoresNonJavascriptFiles() {
    stubFs.readdirSync = function() {
        return ['image.png'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs});

    assert.deepEqual(
        loader.LoadModels('./model', mongoose),
        []
    );
}

function LoadModelsThrowsErrorOnInvalidModels() {
    stubPath.resolve = function(source, file) {
        return './test/testfiles/model/invalidModel.js';
    };
    stubFs.readdirSync = function() {
        return ['invalidModel.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.throws(
        function() {
            loader.LoadModels('./model', mongoose)
        },
        Error
    );
}

function LoadModelsThrowsErrorOnValidModelsWithoutASchema() {
    stubPath.resolve = function(source, file) {
        return './test/testfiles/model/validModelNoSchema.js';
    };
    stubFs.readdirSync = function() {
        return ['validModelNoSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    assert.throws(
        function() {
            loader.LoadModels('./model')
        },
        Error
    );
}

function LoadModelsLoadsValidModelsIntoMongoose() {
    var i = 0;
    stubPath.resolve = function(source, file) {
        if ('validSchema.js' === file && i === 0) {
            i = 1;
            return './test/testfiles/schema/validSchema.js';
        }

        if ('validSchema.js' === file)
            return  './test/testfiles/model/validSchema.js';

        if ('./model' === file)
            return './test/testfiles/model';

        return './test/testfiles/schema';
    };
    stubFs.readdirSync = function(source) {
        return ['validSchema.js'];
    };
    loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

    loader.LoadSchemas('./schema', mongoose);
    var models = loader.LoadModels('./model', mongoose);

    assert.ok(new (models['validSchema'])());
}
