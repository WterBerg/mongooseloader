'use strict';

module.exports = function(mongoose, schema) {
    var model = mongoose.model('validModelNoSchema', schema);
    return model;
};