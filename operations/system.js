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
           id: les_groups.id,
           status: true
       });
    });
}


module.exports = async function () {
    await PaymentForClass();
};
