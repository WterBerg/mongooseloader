'use strict';

var schema = {};
schema.getRequiredSchemas = function() {
    return [];
};
schema.getSchema = function(mongoose, schemas) {
    return mongoose.Schema({
        myProp: String
    });
};

module.exports = schema;
