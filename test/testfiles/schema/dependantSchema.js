'use strict';

var schema = {};
schema.getRequiredSchemas = function() {
    return ['dependingSchema'];
};
schema.getSchema = function(mongoose, schemas) {
    return mongoose.Schema({
        prop: schemas['dependingSchema']
    });
};

module.exports = schema;