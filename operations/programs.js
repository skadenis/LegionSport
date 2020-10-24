'use strict';
let DataBase = require('../components/database/index');
let rights = require('./rights');

let config = require('../components/config/index');
let jwt = require('jsonwebtoken');


class SystemUsers {
    constructor(){

    }

    async get_all_programs(){
        return await new DataBase('system_users').getBy('is_deleted', false);
    }
    async get_program_info(data){
        return {
            status: 200,
            data: await new DataBase('system_users').getById(data.id)
        }
    }
    async create_program(data){
        // data format
        // {login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        let programs = await new DataBase('programs').getBy('login',data.login);
        if(programs.length === 0){
            let answ = await new DataBase('programs').add(data)
            return{
                status: 200,
                data: answ
            };
        }else{
            return {
                status: 400,
                description: 'login is not free'
            }
        }


    }
    async edit_program(data){
        // data format
        // {id: 'int',login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        let system_user = await new DataBase('programs').getBy('id', data.id);
        if(system_user.length > 0) {
            return {
                status: 200,
                data: await new DataBase('programs').edit(data)
            };
        }else{
            return {
                status: 400,
                description: 'There is no user with such id'
            }
        }
    }
    async delete_program(data){

        let system_user = await new DataBase('programs').getBy('id', data.id);
        if(system_user.length > 0){
            let update_data = {
                id: data.id,
                is_deleted: true
            };

            return{
                status: 200,
                data: await new DataBase('programs').edit(update_data)
            };
        }else {
            return{
                status: 400,
                description: 'no program with such id'
            }
        }


    }
}

module.exports = SystemUsers;
