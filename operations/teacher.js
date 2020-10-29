'use strict';
let DataBase = require('../components/database/index');

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
};

