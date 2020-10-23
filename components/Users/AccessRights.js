let User = require('./Users');
let DataBase = require('../database/index');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

class AccessRights extends User{
    constructor(token){
        super();
        this.user_info = jwt.verify(token, config.jwt.secretKey);
    }

    async CheckRights(ReqRights) {

        console.log(this.user_info);
        return this.user_info.rights[ReqRights];
    }
}

module.exports = AccessRights;
