'use strict';
let DataBase = require('../components/database/index');

class Groups {
    constructor(){
    }

    async get_all_groups(){
        return await new DataBase('objects').getBy('is_deleted', false);
    }
    async get_all_groups_on_obj(data){
        return await new DataBase('groups').query('SELECT * FROM groups WHERE object_id = $1 and is_deleted = $2', [data.object, false]);
    }
    async get_group_info(data){
        return {
            status: 200,
            data: await new DataBase('objects').getById(data.id),
            childs_in_group: []
        }
    }

    async create_group(data){
        // data format
        // {name: 'string', description: 'string'}
        await new DataBase('groups').add(data);
    }

    async edit_group(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        await new DataBase('groups').edit(data);
    }

    async delete_group(data){
        let update_data = {
            id: data.id,
            is_deleted: true
        };
        await new DataBase('groups').edit(update_data);
    }

}
