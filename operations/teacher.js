'use strict';
let DataBase = require('../components/database/index');
let config = require('../components/config/index');
let jwt = require('jsonwebtoken');


module.exports = class teacher {

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

    static async create(data){
        let newPer = await new DataBase('teachers').add(data);
        // await new DataBase('child_has_login_info').add({
        //     login: newChild.id,
        //     password: 12312
        // });
        //
        // await new cash_transfer().create_enterence_payment({id: newChild.id});
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
        let auth_users = await new DataBase('teachers').getBy('id', data.login);

        if(auth_users > 0){
            let user_pass = (await new DataBase('teachers_has_password').getBy('teacher_id', data.login))[0]['password'];
            if (user_pass === data.password){
                user = auth_users[0];

                let token = await jwt.sign(user, config.jwt.secretKey, { algorithm: config.jwt.algorithm });
                return {status: 200, info: user, token: token};
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

