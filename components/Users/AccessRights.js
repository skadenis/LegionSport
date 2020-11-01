let User = require('./Users');
const jwt = require('jsonwebtoken');
const config = require('../config/index');

class AccessRights extends User{
    constructor(token){
        super();
        this.user_info = jwt.verify(token, config.jwt.secretKey);
    }

    async CheckRights(ReqRights) {
        if (this.user_info.role === 'teacher'){
            return true;
        } else {
            return this.user_info.rights[ReqRights];
        }
    }
}

module.exports = AccessRights;
