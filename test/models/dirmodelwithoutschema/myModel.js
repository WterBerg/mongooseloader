'use strict';

module.exports = (mongoose, schema) => {
    return mongoose.model('myModel', schema);
};