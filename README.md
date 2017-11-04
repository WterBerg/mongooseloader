# @wrpterberg/mongooseloader
[![Build Status](https://travis-ci.org/WterBerg/mongooseloader.svg?branch=master)](https://travis-ci.org/WterBerg/mongooseloader)

Allows you to easily load all your schemas and/or models into mongoose.

## Installation
```JavaScript
npm install @wrpterberg/mongooseloader
```

## Usage
```JavaScript
const mongoose = require('mongoose');
const loader = require('@wrpterberg/mongooseloader');

loader.loadSchemas('./schema', mongoose);
loader.loadModels('./model', mongoose);

let myModel = new mongoose.model('myModel');
```

All schemas and models are now part of your mongoose object.

### Schemas and Models
All javascript files found inside the given source directory must adhere to the structure as defined below. All non-javascript files inside the source directory are ignored. All javascript files that do not export an object with the given functions below are also ignored.

```JavaScript
let schema = {};
schema.getRequiredSchemas = () => {
    return ['Item'];
};
schema.getSchema = (mongoose, schemas) => {
    return mongoose.Schema({
        items: [schemas['Item']]
    });
};

module.exports = schema;
```

For models all the same rules apply, the structure they must adhere to is as below. It also requires that a schema has already been defined which names matches the model to be loaded into Mongoose.

```JavaScript
module.exports = (mongoose, schema) => {
    let model = mongoose.model('myModel', schema);

    // model function definitions go here.

    return model;
};
```

## Test
```JavaScript
npm test
```