'use strict';
let User = require('./Users');
let DataBase = require('../database/index');

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
            console.log(token);
            this.user_info = jwt.verify(token, config.jwt.secretKey);
        } catch(err) {
            this.error = err;
        }

        console.log(this.error);
        console.log(this.user_info.iat);

        if(!this.error && this.user_info.iat + 24*60*60*1000 > Date.now() / 1000){
            return true;
        }else {
            console.log(this.error);
            return false
        }
    }
}


module.exports = Authorization;
