'use strict';

let schema = {};
schema.getRequiredSchemas = () => {
    return [];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        myProp: String
    });
};

module.exports = schema;
