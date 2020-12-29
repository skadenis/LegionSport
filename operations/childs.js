'use strict';
let DataBase = require('../components/database/index');
let cash_transfer = require('./cash_transfer');
let jwt = require('jsonwebtoken');

let generate_password = require('../components/functions/generetePassword')
let nodemailer = require('nodemailer');
let config = require('../components/config/index');
let asyncForEach = require('../components/functions/asyncForEach');

module.exports = class childs {

    async auth(data){
        data.login = Number(data.login);
        let auth_users = await new DataBase('childs').getBy('id', data.login);

        if(auth_users.length > 0){
            let user_pass = (await new DataBase('child_has_login_info').getBy('login', data.login))[0]['password'];
            if (user_pass === data.password){
                let user = auth_users[0];
                user.role = 'student';

                let token = await jwt.sign(user, config.jwt.secretKey, { algorithm: config.jwt.algorithm });
                return {status: 200, info: user, role: 'student', token: token};
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

    static async get_child_client_lessons(data){
        let lessons = await new DataBase('lessons').DB_query('SELECT lessons.id, lessons.date_time, lessons.videolink, lessons.name, lessons.description, lessons.homework FROM lessons\n' +
            ' JOIN groups g on lessons.group_id = g.id\n' +
            ' JOIN child_has_groups chg on g.id = chg.group_id\n' +
            ' WHERE\n' +
            '    lessons.is_deleted = $1\n' +
            '    and\n' +
            '     lessons.date_time < now() + interval \'4 day\' and lessons.date_time > now() - interval \'7 day\'' +
            '    and\n' +
            '    chg.child_id = $2 ORDER BY lessons.date_time DESC',[false, data.id]);

        await asyncForEach(lessons, async function (lesson, key){
            lessons[key].homework = lesson.homework.data

            console.log(new Date(lesson.date_time))

            console.log(new Date(lesson.date_time));
            console.log(new Date().addHours(3) );


            if(new Date(lesson.date_time) <= new Date().addHours(3) ){
                lessons[key].homework.push('Домашнее задание отсутствует!')
            }
        });


        return {
            status:200,
            data: lessons
        };
    }
    static async get_child_active_bills(data){
        return {
            status: 200,
            data: await new DataBase('child_has_bills').DB_query('SELECT id, amount, description, date FROM child_has_bills WHERE child_id = $1 and payed = $2 ', [data.id, false])
        }
    }
    static async get_all_childs(){
        return await new DataBase('childs').DB_query('SELECT * FROM childs WHERE is_deleted = false ORDER BY childs.surname ASC');
    }
    static async get_all_childs_on_obj(data){
        return await new DataBase('childs').DB_query('SELECT childs.* FROM childs JOIN groups on childs.group_id = groups.id WHERE groups.object_id = $1 and childs.is_deleted = $2', [data.object, false]);
    }
    static async get_all_childs_on_group(data){
        return await new DataBase('childs').DB_query('SELECT * FROM childs WHERE group_id = $1 and is_deleted = $2', [data.group_id, false]);
    }
    static async get_child_info(data){
        let childsA = await new DataBase('childs').getBy('id', data.id);
        if(childsA.length > 0){

            childsA[0].password = (await new DataBase('child_has_login_info').getBy('id', data.id))[0]['password'];

            childsA[0].description = childsA[0].description ? childsA[0].description : "";
            childsA[0].email = childsA[0].email ? childsA[0].email : "";
            childsA[0].phone = childsA[0].phone ? childsA[0].phone : "";

            return {
                status: 200,
                data: childsA[0]
            }
        }else {
            return {
                status: 404
            }
        }

    }
    static async get_all_childs_on_program(data){
        return await new DataBase('childs').DB_query('SELECT childs.* FROM childs JOIN groups on childs.group_id = groups.id JOIN objects ON groups.object_id = objects.id WHERE objects.program_id = $1 and childs.is_deleted = $2', [data.program, false]);
    }
    async create_child(data){
        // data format
        // {name: 'string', description: 'string'}
        let newChild = await new DataBase('childs').add(data);
        let password = generate_password(7);

        await new DataBase('child_has_login_info').insert({
            id: Number(newChild.id),
            login: newChild.id,
            password: password
        });

        await this.send_auth_data(newChild.id, password, newChild.email);

        await new cash_transfer().create_enterence_payment({id: newChild.id});
        return {status:200, id:newChild.id};
    }
    static async edit_child(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        await new DataBase('childs').edit(data);
        return {status:200};
    }
    static async delete_child(data){
        let update_data = {
            id: data.id,
            is_deleted: true
        };
        await new DataBase('childs').edit(update_data);
    }
    async update_password(data){
        let childs = await new DataBase('childs').DB_query('SELECT * FROM childs WHERE id = $1 and is_deleted = $2',[data.id, false]);
        if(childs.length > 0){
            let child = childs[0];

            let password = await generate_password(7);
            await new DataBase('child_has_login_info').update({
                id: child.id,
                login: child.id,
                password: password
            });

            await this.send_auth_data(child.id, password, child.email);
            return {status: 200};

        }else {
            return {status: 404};
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
            from: config.mail.email+' <'+config.mail.email+'>',
            to: email+' <'+email+'>',
            subject: 'Данные для доступа студента',
            html:'' +
                '<p>Ниже мы отправляем вам информацию для доступа в систему</p>' +
                '<p>Постарайтесь предотвратить доступ посторонних людей к этой информации.</p>' +

                '<p><b>Ваш логин:</b> '+login+'</p>'+
                '<p><b>Ваш пароль:</b> '+password+'</p>' +
                '<p>Для доступа в систему перейдите по ссылке <a href="http://customer.online-academy.by">http://customer.online-academy.by</a></p>' +


                '<p>Приятной вам работы!</p>' +
                '<p><i>С уважением,</br>' +
                'ООО «Новые Образовательные Технологии»</i></p>'
        };

        console.log(message);
        await transport.sendMail(message, function(error){
            if(error){
                console.log('Error occurred');
                console.log(error.message);
            }else {
                transport.close();
            }
        });
    }
}

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
