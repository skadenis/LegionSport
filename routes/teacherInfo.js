'use strict';
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../components/config/index');

let Policy = require('cors');
let Schema = require('../components/functions/schema');
let RequestFormat = require('../components/schema/RequestFormat');

const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManageChilds');

let groups = require('../operations/groups');


router.get('/groups', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {
    let token_info = jwt.verify(req.token, config.jwt.secretKey);

    let data = await groups.get_teacher_groups({id: token_info.id});
    res.json(data);
});


module.exports = router;
