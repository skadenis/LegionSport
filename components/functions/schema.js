'use strict';
let createSchema = require('json-gate').createSchema;

class Schema{
    constructor(Schema){
        this.Schema = Schema
    }

    async validate(data){
        let Schema = createSchema(this.Schema);
        try {
            Schema.validate(data);
        } catch(err) {
            throw new Error(err);
        }
        return true;
    }


}

module.exports = Schema;
