'use strict';

module.exports = class RequestFormat {
    static async auth(){
        return {
            type: 'object',
            properties: {
                login: {
                    type: 'string',
                    required: true
                },
                password: {
                    type: 'string',
                    required: true
                }
            },
            additionalProperties: false
        };
    }
};
