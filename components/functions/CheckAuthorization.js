'use strict';

let Authorization = require('../Users/Authorization');

module.exports = async function CheckAuthorization(req, res, next) {
    let data = await new Authorization().CheckAuthorization(req.token);
    switch(data.status) {
        case true:
            req.user_info = data.data;
            next();
            break;
        case false:
            res.status(401);
            res.json({status: 401 ,error:"Authorization Required"});
            break;
        default:
            res.status(500);
            res.json({status: 500 ,error:"Server Error"});
            break;
    }
};


