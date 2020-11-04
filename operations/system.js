'use strict';
let DataBase = require('../components/database/index');
let cash_transfer = require('./cash_transfer');
let groups = require('./groups');
let asyncForEach = require('../components/functions/asyncForEach');

async function PaymentForClass() {
    let query = 'SELECT lessons.id, groups.id as g_id, groups.name as g_name, objects.name as o_name, programs.name as p_name, season_tickets.price FROM lessons JOIN groups ON groups.id = lessons.group_id JOIN objects ON groups.object_id = objects.ID join programs ON programs.id = objects.program_id JOIN season_tickets on groups.ticket_id = season_tickets.id WHERE date_time < now() and status != true';
    let les_groups = await new DataBase().DB_query(query);

    await asyncForEach(les_groups, async function (group) {

        let childs = await new groups().childs_in_group({group_id: group.g_id});
        await asyncForEach(childs, async function (child) {
            await cash_transfer.create_cash_transfer({
                child_id: child.id,
                sum: group.price,
                description: 'Оплата за занятие '+(new Date())+' в группе '+group.p_name+' - '+group.o_name+' - '+group.g_name
            });
        });

        await new DataBase('lessons').edit({
           id: group.id,
           status: true
       });
    });
}

async function make_video_links(){

    // Получение списка уроков которые начнуться через 5 минут //
    let lessons = await lessons_start_in_5_minutes();

    console.log(lessons);

    await asyncForEach(lessons, async function (lesson){
        console.log(lesson);
        let link = await generate_link(lesson);
        console.log(link);

        await new DataBase('lessons').edit({
            id: lesson.id,
            videolink: link
        });
    });

}

async function generate_link(){
    return 'https://tut.by/'
}

async function lessons_start_in_5_minutes(){
    return await new DataBase('lessons').DB_query('SELECT * FROM lessons ' +
        'WHERE lessons.is_deleted = $1 and date_time < now() + (300 * interval \'1 second\') + (3 * interval \'1 hour\') and videolink is null',[false]);
}


module.exports = start;


async function start() {
    await PaymentForClass();
    await make_video_links();
};
start();