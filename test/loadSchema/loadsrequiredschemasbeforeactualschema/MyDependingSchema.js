'use strict';

let schema = {};
schema.getRequiredSchemas = () => {
    return ['TheRequiredSchema'];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        myProp: schemas['TheRequiredSchema']
    });
};

module.exports = schema;
