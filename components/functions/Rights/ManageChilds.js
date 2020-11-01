'use strict';
let AccessRights = require('../../Users/AccessRights');

module.exports = async function CheckRights(req, res,next) {
    switch (await new AccessRights(req.token).CheckRights('edit_childs')) {
        case true:
            next();
            break;
        case false:
            res.status(403);
            res.json({error:"Forbidden"});
            break;
        default:
            res.status(500);
            res.json({error:"Server Error"});
            break;
    }
};
