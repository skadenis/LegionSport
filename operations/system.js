'use strict';
let DataBase = require('../components/database/index');

let cash_transfer = require('./cash_transfer');
let groups = require('./groups');
let lessons = require('./lessons');

let asyncForEach = require('../components/functions/asyncForEach');

// Генирация счета на оплату урока который был посещен
async function PaymentForClass() {
    console.log('PaymentForClass');
    let query = 'SELECT lessons.id, groups.id as g_id, groups.name as g_name, objects.name as o_name, programs.name as p_name, season_tickets.price FROM lessons JOIN groups ON groups.id = lessons.group_id JOIN objects ON groups.object_id = objects.ID join programs ON programs.id = objects.program_id JOIN season_tickets on groups.ticket_id = season_tickets.id WHERE date_time < now() and status != true';
    let les_groups = await new DataBase().DB_query(query);

    await asyncForEach(les_groups, async function (group) {

        let childs = await new groups().childs_in_group({group_id: group.g_id});
        await asyncForEach(childs, async function (child) {
            await cash_transfer.create_cash_transfer({
                child_id: child.id,
                sum: (-1) * group.price,
                description: 'Оплата за занятие '+(new Date())+' в группе '+group.p_name+' - '+group.o_name+' - '+group.g_name
            });
        });

        await new DataBase('lessons').edit({
           id: group.id,
           status: true
       });
    });
}

// Генерация счетов на оплату//
async function generate_invoices(){
}

// Генерация уроков на следующий месяц
async function generate_lessons_next_mounth(){
    let all__groups = await groups.get_all();
    let start_date, finish_date;

    start_date = new Date();
    finish_date = new Date();
    finish_date.setMonth(finish_date.getMonth()+1);

    await asyncForEach(all__groups, async function (group, key){
        let lessons_dates = await get_mounth_dates_by_timesheet(start_date, finish_date, group.timesheet.timesheet);
        console.log(lessons_dates);
        await asyncForEach(lessons_dates, async function (date, key_date){
            await new lessons().create({
                group_id: group.id,
                date_time: date.date,
                name: 'Урок - '+group.id,
                description: '',
                files: {data:[]},
                homework: {data:[]},
                teacher_id: group.teacher_id
            });
        });
    });
}


// Функция работает не включая последний день
async function get_mounth_dates_by_timesheet(start_date, finish_date, timesheet){
// Функция необходима для получения массива дат в месяце по указанным датам
    let date_count = datediff(start_date, finish_date);
    let results = [];

    console.log(timesheet);

    for (let i = 0; i < date_count; i++) {
        let date = new Date(start_date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        date.setDate(date.getDate() + i);
        let day = (date.getDay());


        let check_is_available = await check_is_available_day(day, timesheet);
        if(check_is_available.result){
            // Время проведения урока
            // check_is_available.time;
            let time = (check_is_available.time).split(':');

            console.log('time:'+time);
            console.log('date:'+date)
            date.setMinutes(date.getMinutes()+(Number(time[0])*60)+Number(time[1]));

            results.push({
                date
            })
        }
    }

    return results;
}

async function check_is_available_day(day, timesheet){
    let result = false;
    let time = '';


    if(timesheet && timesheet.length > 0){
        await asyncForEach(timesheet, async function (date){
            if(day === date.day){
                result = true;
                time = date.time
            }
        })
    }


    return {
        result,
        time
    };

}

function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}
function datediff(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}


module.exports = {
    func_generate_lessons_next_mounth: generate_lessons_next_mounth,
    func_payment_for_class: PaymentForClass,
    func_generate_invoices: generate_invoices
};
