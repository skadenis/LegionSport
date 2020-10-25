'use strict';
let DataBase = require('../components/database/index');



module.exports = class groups {
    constructor(){
    }

    async get_child_groups(data){
        let OperationWithChilds = require('../operations/childs');
        let info_child = await OperationWithChilds.get_child_info(data);
        let r_data;


        switch (info_child.status) {
            case 200:
                let groups = await new DataBase('child_has_groups').DB_query('SELECT groups.id, groups.name as group_name, objects.name as object_name, programs.name as program_name FROM child_has_groups JOIN groups ON groups.id = child_has_groups.group_id JOIN objects ON objects.id = groups.object_id JOIN programs on programs.id = objects.program_id WHERE child_id = $1', [data.id]);

                r_data = {
                    status: 200,
                    groups: groups
                };
                break;
            default:
                r_data = {
                    status: 404,
                    description: 'no child with such id'
                };
                break;
        }
        return r_data;
    }
    async child_add_to_group(data){
        let users = await new DataBase('childs').getBy('id', data.id);
        if(users.length > 0){
            let answ = await new DataBase('child_has_groups').add({
                child_id: data.id,
                group_id: data.group_id
            });

            return {
                status: 200,
                info: answ
            }

        }else {
            return {
                status: 404,
                description: 'no child with such id'
            }
        }
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
