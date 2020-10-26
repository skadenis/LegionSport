'use strict';
let DataBase = require('../components/database/index');



module.exports = class groups {
    constructor(){
    }

    static async get_child_groups(data){
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
    static async child_add_to_group(data){
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

    static async get_all(){
        return await new DataBase('objects').getBy('is_deleted', false);
    }
    static async get_all_groups_on_obj(data){
        return {
            status: 200,
            data: await new DataBase('groups').query('SELECT * FROM groups WHERE object_id = $1 and is_deleted = $2', [data.object, false])
        };
    }
    async childs_in_group(data){
        return await new DataBase('').DB_query('SELECT childs.id, childs.name, childs.surname, childs.lastname FROM child_has_groups JOIN childs on childs.id = child_has_groups.child_id WHERE group_id = $1 ',[data.group_id])
    }
    async get_info(data){
        return {
            status: 200,
            data: await new DataBase('groups').getById(data.id),
            childs_in_group:await this.childs_in_group({group_id: data.id})
        }
    }
    async create(data){
        // data format
        // {name: 'string', description: 'string'}
        let Sdata = await new DataBase('groups').add(data);
        let answ =  (await this.get_info({id:Sdata.id})).data;

        return{
            status: 200,
            data: answ
        };
    }
    async edit(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        let Sdata = await new DataBase('groups').edit(data);
        return{
            status: 200,
            data: (await this.get_info({id:Sdata.id})).data
        };
    }
    static async delete(data){
        let update_data = {
            id: data.id,
            is_deleted: true
        };
        await new DataBase('groups').edit(update_data);
        return {
            status: 200, groups: await new DataBase('groups').DB_query('SELECT * FROM groups WHERE object_id = $1 and is_deleted = $2', [data.id,false])
        }
    }

};
