'use strict';

let schema = {};
schema.getRequiredSchemas = () => {
    return ['dependingSchema'];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        prop: schemas['dependingSchema']
    });
};

module.exports = schema;
