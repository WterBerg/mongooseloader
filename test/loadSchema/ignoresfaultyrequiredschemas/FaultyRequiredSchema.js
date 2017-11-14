'use strict';

let schema = {};
schema.getRequiredSchemas = () => {
    return ['ImRequired'];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        myProp: String
    });
};

module.exports = schema;
