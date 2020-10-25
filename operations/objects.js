'use strict';
let DataBase = require('../components/database/index');

class Objects {
    constructor(){

    }

    static async get_all(){
        return {
            status:200,
            data: await new DataBase('objects').getBy('is_deleted', false)
        };
    }
    static async get_all_by_program(data){
        return {
            status:200,
            data: await new DataBase('objects').DB_query('SELECT objects.* FROM objects JOIN programs ON programs.id = objects.program_id WHERE objects.id_deleted = $1 and programs.id = $2', [false,data.program_id])
        }
    }

    async get_info(data){
        let programsA = await new DataBase('objects').getBy('id', data.id);
        if(programsA.length > 0){
            let groups = await new DataBase('groups').getBy('object_id', data.id);
            return {
                status: 200,
                data: programsA[0],
                groups
            }
        }else {
            return {
                status: 404
            }
        }
    }
    static async create(data){
        // data format
        // {login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        return{
            status: 200,
            data: await new DataBase('objects').add(data)
        };
    }
    async edit(data){
        // data format
        // {id: 'int',login: 'string', password: 'string', rights: 'int', name: 'string', surnanme: 'string', lastname: 'string', email: 'string' }
        let prog_info = await this.get_user_info(data);
        let r_data;

        switch (prog_info.status) {
            case 200:
                let answ = await new DataBase('objects').edit(data);
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
    async delete(data){

        let prog_info = await this.get_info(data);
        let r_data;

        switch (prog_info.status) {
            case 200:
                r_data = await this.edit({
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

module.exports = Objects;
