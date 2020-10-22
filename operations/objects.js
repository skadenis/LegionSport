'use strict';
let DataBase = require('../components/database/index');

class Programs {
    constructor(){

    }

    async get_all_objects(){
        return await new DataBase('objects').getBy('is_deleted', false);
    }
    async get_object_info(data){
        return {
            status: 200,
            data: await new DataBase('objects').getById(data.id)
        }
    }
    async create_object(data){
        // data format
        // {name: 'string', description: 'string', program_id: 'int'}
        await new DataBase('objects').add(data);
    }
    async edit_object(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        await new DataBase('objects').edit(data);
    }
    async delete_object(data){

        let update_data = {
            id: data.id,
            is_deleted: true
        };
        await new DataBase('objects').edit(update_data);
    }
}
