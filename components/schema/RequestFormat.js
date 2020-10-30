'use strict';

module.exports = class RequestFormat {
    // Все что связано с компонентом системные учетки
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

    // Все что связано с компоненотом ДЕТИ
    static async get_all_childs_on_obj(){
        return {
            type: 'object',
            properties: {
                object: {
                    type: 'number',
                    required: true
                }
            },
            additionalProperties: false
        };
    }
    static async get_all_childs_on_group(){
        return {
            type: 'object',
            properties: {
                group: {
                    type: 'number',
                    required: true
                }
            },
            additionalProperties: false
        };
    }
    static async get_all_childs_on_program(){
        return {
            type: 'object',
            properties: {
                program: {
                    type: 'number',
                    required: true
                }
            },
            additionalProperties: false
        };
    }
    static async add_child(){
        return {
            type: 'object',
            properties: {
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
                birthday: {
                    type: 'date',
                    required: true
                },
                is_boy:{
                    type: 'boolean',
                    required: true
                },
                description:{
                    type: 'string',
                    required: true
                },
            },
            additionalProperties: false
        };
    }
    static async edit_child(){
        return {
            type: 'object',
            properties: {
                id: {
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
                birthday: {
                    type: 'date',
                    required: true
                },
                is_boy:{
                    type: 'boolean',
                    required: true
                },
                description:{
                    type: 'string',
                    required: true
                },
            },
            additionalProperties: false
        };
    }
    static async delete_child(){
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
    static async payments_child(){
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
    static async add_payment(){
        return {
            type: 'object',
            properties: {
                child_id: {
                    type: 'number',
                    required: true
                },
                sum: {
                    type: 'number',
                    required: true
                },
                description: {
                    type: 'string',
                    required: true
                },
            },
            additionalProperties: false
        };
    }

    static async add_to_group(){
        return {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    required: true
                },
                group_id: {
                    type: 'number',
                    required: true
                }
            },
            additionalProperties: false
        };
    }
    static async representatives_by_child_id(){
        return {
            type: 'object',
            properties: {
                child_id: {
                    type: 'number',
                    required: true
                }
            },
            additionalProperties: false
        };
    }
    static async representatives_add(){}
    static async representatives_edit(){
        return {
            type: 'object',
            properties: {
                id: {
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
                phone: {
                    type: 'string',
                    required: true
                },
                who: {
                    type: 'string',
                    required: true
                },
                child_id: {
                    type: 'number',
                    required: true
                },

            },
            additionalProperties: false
        };
    }
    static async representatives_delete(){
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
    static async edit_teacher(){
        return {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    required: true
                }
            }
            // additionalProperties: true
        };
    }
    static async delete_teacher(){
        return {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                    required: true
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
                birthday: {
                    type: 'date',
                    required: false
                },
                description: {
                    type: 'string',
                    required: false
                },
                email: {
                    type: 'string',
                    required: true
                },
                phone: {
                    type: 'number',
                    required: true
                },
            },
            additionalProperties: false
        };
    }

};
