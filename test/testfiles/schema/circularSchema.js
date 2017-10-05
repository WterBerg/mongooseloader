'use strict';

var schema = {};
schema.getRequiredSchemas = function() {
    return ['circularSchema'];
};
schema.getSchema = function(mongoose, schemas) {
    return mongoose.Schema({
        prop: schemas['circularSchema']
    });
};

module.exports = schema;