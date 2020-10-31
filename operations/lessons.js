'use strict';
let DataBase = require('../components/database/index');

let teachers = require('./teacher');
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



        let teacher = await teachers.get_info({id: info.teacher_id});
        let r_teacher = {};
        if(teacher.status === 200){
            r_teacher.teacher = teacher.data;
        } else {
            r_teacher.teacher=null;
        }



        return {
            status: 200,
            data: await new DataBase('lessons').getById(data.id),
            teacher: r_teacher.teacher
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
        let r_data = {
            status: 200,
            data: (await this.get_info({id:Sdata.id})).data,
        };

        let teacher = await new teachers.get_info({id:r_data.data.teacher_id});
        if(teacher.status === 200){
            r_data.teacher = teacher.data;
        } else {
            r_data.teacher=null;
        }
        return r_data;
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
