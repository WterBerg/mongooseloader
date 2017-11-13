'use strict';

module.exports = (mongoose, schema) => {
    return mongoose.model('MySuperValidDocument', schema);
};
