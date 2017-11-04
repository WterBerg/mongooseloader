'use strict';

let schema = {};
schema.getRequiredSchemas = () => {
    return [];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        prop: String
    });
};

module.exports = schema;
