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
    static async create_system_user(){
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
                },
                rights:{
                    type: 'number',
                    required: true
                },
                name: {
                    type: 'string',
                    required: true
                },
                surname: {
                    type: 'string',
                    required: true
                },
                lastname: {
                    type: 'string',
                    required: true
                },
                email: {
                    type: 'string',
                    required: true
                },

            },
            additionalProperties: false
        };
    }
    static async edit_system_user(){
        return {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    required: true
                },
                login: {
                    type: 'string',
                    required: false
                },
                password: {
                    type: 'string',
                    required: false
                },
                rights:{
                    type: 'number',
                    required: false
                },
                name: {
                    type: 'string',
                    required: false
                },
                surname: {
                    type: 'string',
                    required: false
                },
                lastname: {
                    type: 'string',
                    required: false
                },
                email: {
                    type: 'string',
                    required: false
                },

            },
            additionalProperties: false
        };
    }
    static async delete_system_user(){
        return {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    required: true
                }
            },
            additionalProperties: false
        };
    }
};
