'use strict';

module.exports = (mongoose, schema) => {
    return mongoose.model('validSchema', schema);
};
