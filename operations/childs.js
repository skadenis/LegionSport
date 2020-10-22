'use strict';
let DataBase = require('../components/database/index');
let cash_transfer = require('./cash_transfer');

class Groups {
    constructor(){
    }

    async get_all_childs(){
        return await new DataBase('childs').getBy('is_deleted', false);
    }
    async get_all_childs_on_obj(data){
        return await new DataBase('childs').query('SELECT childs.* FROM childs JOIN groups on childs.group_id = groups.id WHERE groups.object_id = $1 and childs.is_deleted = $2', [data.object, false]);
    }
    async get_all_childs_on_group(data){
        return await new DataBase('childs').query('SELECT * FROM childs WHERE group_id = $1 and is_deleted = $2', [data.group_id, false]);
    }
    async get_child_info(data){
        return {
            status: 200,
            data: await new DataBase('objects').getById(data.id)
        }
    }
    async create_child(data){
        // data format
        // {name: 'string', description: 'string'}
        let newChild = await new DataBase('childs').add(data);

        await new cash_transfer().create_enterence_payment({id: newChild.id});

        // Проведение транзакции Вступительный взнос //
    }
    async edit_child(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        await new DataBase('childs').edit(data);
    }
    async delete_child(data){
        let update_data = {
            id: data.id,
            is_deleted: true
        };
        await new DataBase('childs').edit(update_data);
    }

}
