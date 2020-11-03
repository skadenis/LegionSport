'use strict';
let DataBase = require('../components/database/index');
let cash_transfer = require('./cash_transfer');

let generate_password = require('../components/functions/generetePassword')
let nodemailer = require('nodemailer');
let config = require('../components/config/index');

module.exports = class childs {

    static async get_all_childs(){
        return await new DataBase('childs').getBy('is_deleted', false);
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

