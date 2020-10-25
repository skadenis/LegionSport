'use strict';
let DataBase = require('../components/database/index');

module.exports = class cash_transfer{
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
    static async get_child_payments(data){
        let OperationWithChilds = require('../operations/childs');
        let info_child = await OperationWithChilds.get_child_info(data);

        let r_data;
         switch (info_child.status) {
             case 200:
                 r_data = {status: 200, data: await new DataBase('cash_transfer').getBy('child_id', data.id)};
                 break;
             case 404:
                 r_data = {status: 404, description: 'no child with such id'};
                 break;
         }
         return r_data;
    }
    static async create_cash_transfer(data){
        // data format
        // {child_id: 'int', sum: 'numeric', description: 'string'}

        // Калькулируем данные в cash_transfer и обновляем данные в child info

        let OperationWithChilds = require('../operations/childs');
        let info_child = await OperationWithChilds.get_child_info({id: data.child_id});

        let r_data;

        switch (info_child.status) {
            case 200:
                await new DataBase('cash_transfer').add(data);
                let newWallet = (info_child.data.wallet + data.sum);
                await OperationWithChilds.edit_child({
                    id: data.child_id,
                    wallet: newWallet
                });
                r_data = {status: 200,data: (await OperationWithChilds.get_child_info({id: data.child_id})).data};
                break;

            default:
                r_data = {status: 404};
                break;
        }

        return r_data;

    }

};
