'use strict';
let DataBase = require('../components/database/index');

class Programs {
    constructor(){

    }

    static async get_all_programs(){
        return await new DataBase('programs').getBy('is_deleted', false);
    }
    static async get_program_info(data){

        let programsA = await new DataBase('programs').getBy('id', data.id);
        if(programsA.length > 0){
            return {
                status: 200,
                data: programsA[0]
            }
        }else {
            return {
                status: 404
            }
        }
    }
    static async create_program(data){
        // data format
        // {login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        return{
            status: 200,
            data: await new DataBase('programs').add(data)
        };
    }
    async edit_program(data){
        // data format
        // {id: 'int',login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        let prog_info = await this.get_user_info(data);
        let r_data;

        switch (prog_info.status) {
            case 200:
                let answ = await new DataBase('programs').edit(data);
                r_data = {
                    status: 200,
                    data: answ
                };
                break;
            default:
                r_data = {
                    status: 400
                };
                break;
        }
        return r_data;
    }
    async delete_program(data){

        let prog_info = await this.get_user_info(data);
        let r_data;

        switch (prog_info.status) {
            case 200:
                r_data = await this.edit_program({
                    id: data.id,
                    is_deleted: true
                });
                break;
            default:
                r_data = {
                    status: 400
                };
                break;
        }
        return r_data;


    }
}

module.exports = Programs;
