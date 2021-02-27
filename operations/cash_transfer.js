'use strict';
let DataBase = require('../components/database/index');
let student = require('../operations/childs');

module.exports = class cash_transfer{
    constructor(){
    }

    static async get_payment_info(data){
        return await new DataBase('cash_transfer').getById(data.id)
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
                 // await new DataBase('cash_transfer').getBy('child_id', data.id
                 let cash_transfers = await new DataBase('cash_transfer').DB_query('SELECT * FROM cash_transfer WHERE child_id = $1 ORDER BY id DESC',[data.id]);
                 r_data = {status: 200, data:cash_transfers };
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
                r_data = {status: 200, data: (await this.get_child_payments({id: data.child_id})).data};
                break;

            default:
                r_data = {status: 404};
                break;
        }

        return r_data;

    }
    static async edit_cash_transfer(data){
        // data format
        // {child_id: 'int', sum: 'numeric', description: 'string'}

        // Калькулируем данные в cash_transfer и обновляем данные в child info

        let OperationWithChilds = require('../operations/childs');
        let info_child = await OperationWithChilds.get_child_info({id: data.child_id});

        let r_data;

        switch (info_child.status) {
            case 200:

                let before_edit__payment_info = await this.get_payment_info({id:data.id});

                await new DataBase('cash_transfer').edit(data);
                let newWallet = (info_child.data.wallet - before_edit__payment_info.sum + data.sum);
                await OperationWithChilds.edit_child({
                    id: data.child_id,
                    wallet: newWallet
                });
                r_data = {status: 200, data: (await this.get_child_payments({id: data.child_id})).data, student: await  student.get_child_info({id: data.child_id})};
                break;

            default:
                r_data = {status: 404};
                break;
        }

        return r_data;

    }
    static async bepaid_notification(data){
        data = {
            "transaction":{
                "customer":{
                    "ip":"127.0.0.1",
                    "email":"john@example.com"
                },
                "credit_card":{
                    "holder":"John Doe",
                    "stamp":"3709786942408b77017a3aac8390d46d77d181e34554df527a71919a856d0f28",
                    "token":"d46d77d181e34554df527a71919a856d0f283709786942408b77017a3aac8390",
                    "brand":"visa",
                    "last_4":"0000",
                    "first_1":"4",
                    "exp_month":5,
                    "exp_year":2015
                },
                "billing_address":{
                    "first_name":"John",
                    "last_name":"Doe",
                    "address":"1st Street",
                    "country":"US",
                    "city":"Denver",
                    "zip":"96002",
                    "state":"CO",
                    "phone":null
                },
                "payment":{
                    "auth_code":"654321",
                    "bank_code":"05",
                    "rrn":"999",
                    "ref_id":"777888",
                    "message":"Payment was approved",
                    "gateway_id":317,
                    "billing_descriptor":"TEST GATEWAY BILLING DESCRIPTOR",
                    "status":"successful"
                },
                "uid":"1-310b0da80b",
                "status":"successful",
                "message":"Successfully processed",
                "amount":100,
                "test":true,
                "currency":"USD",
                "description":"Test order",
                "tracking_id": "my_tracking_id",
                "type":"payment"
            }
        };

        // Сохраняем ответ JSON в базе данных оплаченных счетов //





    }

};
