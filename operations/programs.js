'use strict';
let DataBase = require('../components/database/index');

class Programs {
    constructor(){

    }

    async get_all_programs(){
        return await new DataBase('programs').getBy('is_deleted', false);
    }
    async get_program_info(data){
        return {
            status: 200,
            data: await new DataBase('programs').getById(data.id)
        }
    }
    async create_program(data){
        // data format
        // {name: 'string', description: 'string'}
        await new DataBase('programs').add(data);
    }
    async edit_program(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        await new DataBase('programs').edit(data);
    }
    async delete_program(data){

        let update_data = {
            id: data.id,
            is_deleted: true
        };
        await new DataBase('programs').edit(update_data);
    }
}
