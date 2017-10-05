'use strict';

var proxyquire = require('proxyquire'),
    assert = require('assert');

var loader,
    stubFs = {},
    stubPath = {},
    stubMongoose = {};

describe('mongooseloader', function() {
   describe('LoadSchemas()', function() {
       it('should return an empty array when no schemas are found', function() {
           stubPath.resolve = function() {
               return './testfiles/schema';
           };
           stubFs.readdirSync = function() {
               return [];
           };
           loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

           assert.deepEqual(loader.LoadSchemas('./schema', stubMongoose), []);
       });
       it('should throw an error when trying to load schemas from a invalid location', function() {
           stubPath.resolve = function() {
               return './a/path/that/does/not/exist';
           };
           loader = proxyquire('../loader.js', {'path': stubPath});

           assert.throws(function() {loader.LoadSchemas('./schema')}, Error);
       });
       it('should ignore non-javascript files found in the source directory.', function() {
           stubPath.resolve = function() {
               return './testfiles/schema';
           };
           stubFs.readdirSync = function() {
               return ['image.png'];
           };
           loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

           assert.deepEqual(loader.LoadSchemas('./schema', stubMongoose), []);
       });
       it('should throw an error when javascript files found do not follow the schema template', function() {
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
       });
   });
   describe('LoadModels()', function() {
       it('should return an empty array when no models are found', function() {
           stubPath.resolve = function() {
               return './testfiles/model';
           };
           stubFs.readdirSync = function() {
               return [];
           };
           loader = proxyquire('../loader.js', {'fs': stubFs, 'path': stubPath});

           assert.deepEqual(loader.LoadSchemas('./model', stubMongoose), []);
       })
   });
});
