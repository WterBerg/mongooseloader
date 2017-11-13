'use strict';

module.exports = (mongoose, schema) => {
    return mongoose.model('MyLoadDocument', schema);
};
