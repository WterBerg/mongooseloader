'use strict';

var schema = {};
schema.getRequiredSchemas = function() {
    return [];
};
schema.getSchema = function(mongoose, schemas) {
    return mongoose.Schema({
    });
};

module.exports = schema;