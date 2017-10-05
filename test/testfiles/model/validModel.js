'use strict';

module.exports = function(mongoose, schema) {
    var model = mongoose.model('validSchema', schema);
    return model;
};