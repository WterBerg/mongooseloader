# mongooseloader

Allows you to easily load all your schemas and/or models into mongoose.

## Installation
`npm install @wrpterberg/mongooseloader`

## Usage
    var mongoose = require('mongoose');
    var mongooseloader = require('@wrpterberg/mongooseloader');
    
    mongooseloader.LoadSchemas('./schema', mongoose);
    mongooseloader.LoadModels('./model', mongoose);

    console.log(mongoose);

All schemas and models are now part of your mongoose object.

All files inside your schema folder need to be schemas. Furthermore, the schemas need to adhere to the following structure:

    var schema = {};
    schema.getRequiredSchemas = function() {
        return ['Item'];
    }
    schema.getSchema = function(mongoose, schemas) {
        return mongoose.Schema({
            // your model, schemas that are part of a subschema are found in schemas[schemaName] like this:
            items: [schemas['Item']
        });
    }
    
    module.exports = schema;

For models the following structure is required:

    module.exports = function(mongoose, schema) {
        var model = mongoose.model('Character', schema);
        
        // model function definitions go here.
        
        return model;
    };

## Test
`npm test`