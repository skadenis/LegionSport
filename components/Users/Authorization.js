'use strict';
let User = require('./Users');

const config = require('../config/index');
const jwt = require('jsonwebtoken');


class Authorization extends User{
    constructor(){
        super();
    }

    // Метод CheckAuthorization(token) используеться для проверки токена на валидность
    //
    // @params
    // token - JsonWebToken
    //
    // @response
    // true - пользователь авторизирован
    // false - пользователь неавторизирован
    //
    async CheckAuthorization(token){
        try {
            this.user_info = jwt.verify(token, config.jwt.secretKey);
        } catch(err) {
            this.error = err;
        }

        if(!this.error && this.user_info.iat + 24*60*60*1000 > Date.now() / 1000){
            return {
                status: true,
                data: this.user_info
            };
        }else {
            console.log(this.error);
            return {
                status: false
            };
        }
    }
}


module.exports = Authorization;
