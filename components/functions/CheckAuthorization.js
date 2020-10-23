'use strict';

let Authorization = require('../Users/Authorization');

module.exports = async function CheckAuthorization(req, res, next) {
    switch(await new Authorization().CheckAuthorization(req.token)) {
        case true:
            next();
            break;
        case false:
            res.status(401);
            res.json({error:"Authorization Required"});
            break;
        default:
            res.status(500);
            res.json({error:"Server Error"});
            break;
    }
};


