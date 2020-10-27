'use strict';
let DataBase = require('../components/database/index');



module.exports = class groups {
    constructor(){
    }

    async get_all_lessons_by_group_id(data){
        // return await new DataBase('').DB_query('SELECT * FROM groups WHERE object_id = $1 and is_delete = $2',[data.id, false])
        return [];
    }


    static async get_all(){
        return await new DataBase('groups').getBy('is_deleted', false);
    }
    static async get_all_by_group(data){
        return {
            status: 200,
            data: await new DataBase('groups').query('SELECT * FROM lessons WHERE group_id = $1 and is_deleted = $2 ORDER BY date_time DESC', [data.id, false])
        };
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
