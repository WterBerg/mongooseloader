# @wrpterberg/mongooseloader
[![Build Status](https://travis-ci.org/WterBerg/mongooseloader.svg?branch=master)](https://travis-ci.org/WterBerg/mongooseloader)

Allows you to easily load all your schemas and/or models into mongoose.

## Example usage

### Load all schemas and models
```javascript
const mongoose = require('mongoose'),
      loader = require('@wrpterberg/mongooseloader');

async function prepareMongoose() {
    loader.enableLogging();
    
    await loader.loadSchemas('./schemas');
    await loader.loadModels('./models');
}

prepareMongoose()
    .then(() => {
        let myModel = mongoose.model('MyModel');
    })
    .catch((err) => {
        console.log('Aaah!! My database is on fire!');
        console.log(err);
    });
```

All schemas and models found in their source directories are now part of your mongoose object.

### Load specific schemas and models
```javascript
const mongoose = require('mongoose'),
      loader = require('@wrpterberg/mongooseloader');

async function prepareSomeSchemasAndModels() {
    loader.enableLogging();
    loader.setSchemaSource('./schemas');
    loader.setModelSource('./models');
    
    await loader.loadSchema('MyModel.js');
    await loader.loadSchema('MyOtherModel.js');
    
    await loader.loadModel('MyModel.js');
    await loader.loadModel('MyOtherModel.js');
}

prepareSomeSchemasAndModels()
    .then(() => {
        let myModel = mongoose.model('MyModel');
    })
    .catch((err) => {
        console.log('Aaah!! My database is on fire!');
        console.log(err);
    });
```

The specific schemas and models are now part of your mongoose object.

### Logging
use `loader.enableLogging()` to allow MongooseLoader to log its actions and errors into your `console.log`. This can 
also be disabled again by calling `loader.disableLogging()`. Logging is disabled by default.

## Schema
The name of a schema is resolved to its filename without the file's extension.

A valid schema must follow the rules and template stated below:

**Rules:**
- file extension must be '.js'
- A schema can't already be defined with the same name
- A schema must export the functions `getRequiredSchemas()` and `getSchema()`
- If a schema uses another schema as part of its schema, it must be defined in `getRequiredSchemas()`

### Template
```javascript
let schema = {};
schema.getRequiredSchemas = () => {
    return ['Item'];
};
schema.getSchema = (mongoose, schemas) => {
    let mySchema = mongoose.Schema({
        items: [schemas['Item']]
    });
    
    mySchema.methods.myMethod = (myArgs) => {
        // my method
    };
    
    mySchema.statics.myStaticsMethod = (myArgs) => {
        // myStaticsMethod
    };
    
    return mySchema;
};

module.exports = schema;
```

## Model
The name of a model is resolved to its filename without the file's extension.

A valid model must follow the rules and template stated below:

**Rules:**
- file extension must be '.js'
- The modelfile must export a function
- A model can't already be defined with the same name
- There must already be defined a schema with a matching name of the model

### Template
```javascript
module.exports = (mongoose, schema) => {
    let model = mongoose.model('myModel', schema);

    model.on('myEvent', (myArgs) => {
        // my event handler
    });

    return model;
};
```

## Installation
```node
npm install @wrpterberg/mongooseloader --save
```

## Test
```node
npm test
```