'use strict';
let DataBase = require('../components/database/index');
let cash_transfer = require('./cash_transfer');

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
    static async create_child(data){
        // data format
        // {name: 'string', description: 'string'}
        let newChild = await new DataBase('childs').add(data);
        await new DataBase('child_has_login_info').add({
            login: newChild.id,
            password: 12312
        });

        await new cash_transfer().create_enterence_payment({id: newChild.id});
        return {status:200, id:newChild.id};
        // Проведение транзакции Вступительный взнос //
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
}

