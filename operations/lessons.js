'use strict';
let DataBase = require('../components/database/index');

let teacher = require('./teacher');

module.exports = class groups {
    constructor(){
    }

    async get_all_lessons_by_group_id(data){
        return await new DataBase('').DB_query('SELECT * FROM lessons WHERE group_id = $1 and is_deleted = $2',[Number(data.id), false])
    }


    static async get_all(){
        return await new DataBase('lessons').getBy('is_deleted', false);
    }
    static async get_all_by_group(data){
        return {
            status: 200,
            data: await new DataBase('lessons').query('SELECT * FROM lessons WHERE group_id = $1 and is_deleted = $2 ORDER BY date_time DESC', [data.id, false])
        };
    }

    async get_info(data){
        let info = await new DataBase('lessons').getById(data.id);

        let teacher = await teacher.get_info({id: info.teacher_id});
        if(teacher.status === 200){
            info.teacher = teacher.data;
        } else {
            info.teacher=null;
        }



        return {
            status: 200,
            data: await new DataBase('lessons').getById(data.id)
        }
    }
    async create(data){
        // data format
        // {name: 'string', description: 'string'}
        let Sdata = await new DataBase('lessons').add(data);
        let answ =  (await this.get_info({id:Sdata.id})).data;

        return{
            status: 200,
            data: answ
        };
    }
    async edit(data){
        // data format
        // {id: 'int', name: 'string', description: 'string'}
        let Sdata = await new DataBase('lessons').edit(data);
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
        await new DataBase('lessons').edit(update_data);
        return {
            status: 200
        }
    }

};
