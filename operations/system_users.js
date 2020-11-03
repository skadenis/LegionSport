'use strict';
let DataBase = require('../components/database/index');
let rights = require('./rights');
let generate_password = require('../components/functions/generetePassword')

let nodemailer = require('nodemailer');
let config = require('../components/config/index');
let jwt = require('jsonwebtoken');


class SystemUsers {
    constructor(){

    }

    async get_all_users(){
        return await new DataBase('system_users').getBy('is_deleted', false,['id','name','surname','lastname','login','email','rights']);
    }
    async get_user_info(data){
        let answ = await new DataBase('system_users').getById(data.id);
        delete answ.password;
        return {
            status: 200,
            data: answ
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
                user.rights = await rights(user.rights);
                user.role = 'admin';

                let token = await jwt.sign(user, config.jwt.secretKey, { algorithm: config.jwt.algorithm });
                return_data = {status: 200, info: user, role: 'admin', token: token};

            }else{
                return_data = {status: 401, description: 'have error in password'}
            }

        }else {
            return_data = {status: 404, description: 'no such user'}
        }
        return return_data;
    }
    async create_system_user(data){
        let system_users = await new DataBase('system_users').getBy('login',data.login);

        data.password = await generate_password(7);

        if(system_users.length === 0){
            let answ = await new DataBase('system_users').add(data);

            await this.send_auth_data(data.login, data.password, data.email)
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
    async send_auth_data(login, password, email){

        let transport = await nodemailer.createTransport({
            pool: true,
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure, // use TLS
            auth: {
                user: config.mail.auth.user,
                pass: config.mail.auth.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let message = {
            from: '<'+config.mail.email+'>',
            to: email+' <'+email+'>',
            subject: 'Данные для доступа в панель администратора',
            html:'' +
                '<p>Ниже мы отправляем вам информацию для доступа в систему</p>' +
                '<p>Постарайтесь предотвратить доступ посторонних людей к этой информации.</p>' +
                '<p><b>Ваш логин:</b> '+login+'</p>'+
                '<p><b>Ваш пароль:</b> '+password+'</p>' +
                '<p>Приятной вам работы!</p>' +
                '<p><i>С уважением,</br>' +
                'отдел по работе с персоналом ООО «Новые Образовательные Технологии»</i></p>'
        };
        await transport.sendMail(message, function(error){
            if(error){
                console.log('Error occurred');
                console.log(error.message);
            }else {
                transport.close();
            }
        });
    }
    async edit_system_user(data){
        // data format
        // {id: 'int',login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        let system_user = await new DataBase('system_users').getBy('id', data.id);
        if(system_user.length > 0) {

            if(system_user.login !== data.login){
                let system_user_logins = await new DataBase('system_users').getBy('login', data.login);
                if (system_user_logins.length === 0){
                    delete data.password;
                    return {
                        status: 200,
                        data: await new DataBase('system_users').edit(data)
                    };
                } else {
                    return {
                        status: 400,
                        description: 'login is forbidden'
                    };
                }
            }else{

                return {
                    status: 200,
                    data: await new DataBase('system_users').edit(data)
                };
            }



        }else{
            return {
                status: 400,
                description: 'There is no user with such id'
            }
        }
    }
    async delete_system_user(data){

       let system_user = await new DataBase('system_users').getBy('id', data.id);
       if(system_user.length > 0){
           let update_data = {
               id: data.id,
               is_deleted: true
           };

           return{
               status: 200,
               data: await new DataBase('system_users').edit(update_data)
           };
       }else {
           return{
               status: 400,
               description: 'no user with such id'
           }
       }


    }
    async update_password(data){
        let users = await new DataBase('system_users').DB_query('SELECT * FROM system_users WHERE id = $1 and is_deleted = $2',[data.id, false]);
        if(users.length > 0){
            let user = users[0];

            let password = await generate_password(7);
            await new DataBase('system_users').update({
                id: user.login,
                password: password
            });

            await this.send_auth_data(user.id, password, user.email);
            return {status: 200};

        }else {
            return {status: 404};
        }
    }
}

module.exports = SystemUsers;
