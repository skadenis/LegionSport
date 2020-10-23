'use strict';
let DataBase = require('../components/database/index');


// Вернуть от сюда права доступа к системе
module.exports = async function (user_rights_id) {
    let data = await new DataBase('rights').getById(user_rights_id);

    delete data.id;
    delete data.name;
    return data;
};
