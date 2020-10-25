'use strict';
let DataBase = require('../components/database/index');

let OperationWithChilds = require('./childs');

module.exports = class cash_transfer {
    constructor(){
    }
    async create_enterence_payment(data){
        // let enterence_sum = 19.90;
        // await this.create_cash_transfer({
        //     child_id: data.id,
        //     sum: enterence_sum,
        //     description: 'Списание за вступительный взнос в Клуб'
        // });
    }
    async get_child_payments(data){

        return await OperationWithChilds.get_child_info({id: 2});

        // let r_data;
        //  switch (info.status) {
        //      case 200:
        //          r_data = {status: 200, data: await new DataBase('cash_transfer').getBy('child_id', data.id)};
        //          break;
        //      case 404:
        //          r_data = {status: 404, description: 'no child with such id'};
        //          break;
        //  }
        //  return r_data;
    }
    async create_cash_transfer(data){
            // data format
            // {child_id: 'int', sum: 'numeric', description: 'string'}

            await new DataBase('cash_transfer').add(data);
            // Калькулируем данные в cash_transfer и обновляем данные в child info
        }

};
