'use strict';

module.exports = (mongoose, schema) => {
    return mongoose.model('SomeValidDocument', schema);
};
