# @wrpterberg/mongooseloader
[![Build Status](https://travis-ci.org/WterBerg/mongooseloader.svg?branch=master)](https://travis-ci.org/WterBerg/mongooseloader)

Allows you to easily load all your schemas and/or models into mongoose.

## Installation
```JavaScript
npm install @wrpterberg/mongooseloader
```

## Usage
```JavaScript
var mongoose = require('mongoose');
var mongooseloader = require('@wrpterberg/mongooseloader');

var schemas = mongooseloader.LoadSchemas('./schema', mongoose);
var models = mongooseloader.LoadModels('./model', mongoose);

var myModel = new (models['myModel'])();

var myModel = models['myModel'];
var myObject = new myModel();

console.log(mongoose);
```

All schemas and models are now part of your mongoose object.

### Schemas and Models
All javascript files found inside the given source directory must adhere to the structure as defined below. All non-javascript files inside the source directory are ignored.

```JavaScript
var schema = {};
schema.getRequiredSchemas = function() {
    return ['Item'];
}
schema.getSchema = function(mongoose, schemas) {
    return mongoose.Schema({
        // your model, schemas that are part of a subschema are found in schemas[schemaName] like this:
        items: [schemas['Item']]
    });
}

module.exports = schema;
```

For models all the same rules apply, the structure they must adhere to is as below. It also requires that a schema has already been defined which names matches the model to be loaded into Mongoose.

```JavaScript
module.exports = function(mongoose, schema) {
    var model = mongoose.model('Character', schema);

    // model function definitions go here.

    return model;
};
```

## Test
```JavaScript
npm test
```