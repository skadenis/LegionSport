'use strict';
let DataBase = require('../components/database/index');
let config = require('../components/config/index');
let jwt = require('jsonwebtoken');
let nodemailer = require('nodemailer');

let generate_password = require('../components/functions/generetePassword')


module.exports = class teacher {

    static async update_password(data){
        let teachers = await new DataBase('teachers').DB_query('SELECT * FROM teachers WHERE id = $1 and is_deleted = $2',[data.id, false]);
        if(teachers.length > 0){
            let teacher = teachers[0];

            let password = await generate_password(7);
            await new DataBase('teachers_has_password').update({
                teacher_id: teacher.id,
                password: password
            });

            await this.send_auth_data(teacher.id, password, teacher.email);
            return {status: 200};

        }else {
            return {status: 404};
        }
    }
    static async get_all(){

        return {
            status: 200, data: await new DataBase('teachers').getBy('is_deleted', false)
        };
    }
    static async get_info(data){
        let A = await new DataBase('teachers').getBy('id', data.id);
        if(A.length > 0){
            if(A[0].description === null){
                A[0].description = '';
            }
            return {
                status: 200,
                data: A[0]
            }
        }else {
            return {
                status: 404
            }
        }

    }
    static async send_auth_data(login, password, email){

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
            subject: 'Данные для доступа в панель преподователя',
            html:'' +
                '<p>Ниже мы отправляем вам информацию для доступа в систему</p>' +
                '<p>Постарайтесь предотвратить доступ посторонних людей к этой информации.</p>' +
                '<p><b>Ваш логин:</b> '+login+'</p>'+
                '<p><b>Ваш пароль:</b> '+pass+'</p>' +
                '<p>Приятной вам работы!</p>' +
                '<p><i>С уважением,</br>' +
                'отдел по работе с персооналом ООО «Новые Образовательные Технологии»</i></p>'
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
    static async create(data){
        let newPer = await new DataBase('teachers').add(data);

        let password = await generate_password(7);
        await new DataBase('teachers_has_password').add({
            teacher_id: newPer.id,
            password: password
        });

        await this.send_auth_data(newPer.id, password, newPer.email);

        return {status:200, id:newPer.id, data:newPer};
    }
    static async edit(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        let info = await new DataBase('teachers').edit(data);
        return {status:200, info};
    }
    static async delete(data){
        let update_data = {
            id: data.id,
            is_deleted: true
        };
        await new DataBase('teachers').edit(update_data);
        return {status: 200};
    }
    async auth(data){
        data.login = Number(data.login);
        let auth_users = await new DataBase('teachers').getBy('id', data.login);

        if(auth_users.length > 0){
            let user_pass = (await new DataBase('teachers_has_password').getBy('teacher_id', data.login))[0]['password'];
            if (user_pass === data.password){
                let user = auth_users[0];
                user.role = 'teacher';

                let token = await jwt.sign(user, config.jwt.secretKey, { algorithm: config.jwt.algorithm });
                return {status: 200, info: user, role: 'teacher', token: token};
            } else {
                return {
                    status: 401
                }
            }
        }else{
            return {
                status: 404
            }
        }

    }
};

