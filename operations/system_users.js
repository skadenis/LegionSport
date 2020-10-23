'use strict';
let DataBase = require('../components/database/index');
let rights = require('./rights');

class SystemUsers {
    constructor(){

    }

    async get_all_users(){
        return await new DataBase('system_users').getBy('is_deleted', false);
    }
    async get_user_info(data){
        return {
            status: 200,
            data: await new DataBase('system_users').getById(data.id)
        }
    }
    async auth(data){
        // Data model
        // {login: 'string', password: 'string'}
        let return_data = {};
        let Users = await new DataBase('system_users').getBy('login', data.login);


        if(Users.length > 0){
            // Кодирование пароля
            let user = Users[0]; // Пользователь с одним логином может быть всего один
            if(data.password === user.password){
                delete user.password;
                user.rights = await rights(user.id);

                return_data = {status: 200, info: user};
            }else{
                return_data = {status: 401, description: 'have error in password'}
            }

        }else {
            return_data = {status: 404, description: 'no such user'}
        }
        return return_data;
    }
    async create_system_user(data){
        // data format
        // {login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        return{
            status: 200,
            data: await new DataBase('system_users').add(data)
        };

    }
    async edit_system_user(data){
        // data format
        // {id: 'int',login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        return{
          status: 200,
          data: await new DataBase('system_users').edit(data)
        };
    }
    async delete_system_user(data){

        let update_data = {
            id: data.id,
            is_deleted: true
        };

        return{
            status: 200,
            data: await new DataBase('system_users').edit(update_data)
        };
    }
}

module.exports = SystemUsers;
