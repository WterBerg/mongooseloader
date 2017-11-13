'use strict';

let schema = {};
schema.getRequiredSchemas = () => {
    return [];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        myProp: []
    });
};

module.exports = schema;
