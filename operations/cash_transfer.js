'use strict';
let DataBase = require('../components/database/index');

class cash_transfer {
    constructor(){
    }
    async create_enterence_payment(data){
        let enterence_sum = 19.90;
        await this.create_cash_transfer({
            child_id: data.id,
            sum: enterence_sum,
            description: 'Списание за вступительный взнос в Клуб'
        });
    }
    async get_child_payments(data){
         return await new DataBase('cash_transfer').getBy('child_id', data.id);
    }
    async create_cash_transfer(data){
            // data format
            // {child_id: 'int', sum: 'numeric', description: 'string'}

            await new DataBase('cash_transfer').add(data);
            // Калькулируем данные в cash_transfer и обновляем данные в child info
        }

}
