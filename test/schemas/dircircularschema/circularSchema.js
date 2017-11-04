'use strict';

let schema = {};
schema.getRequiredSchemas = () => {
    return ['circularSchema'];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        prop: schemas['circularSchema']
    });
};

module.exports = schema;
