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
let lessons = require('../operations/lessons');

router.get('/groups', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {
    let token_info = jwt.verify(req.token, config.jwt.secretKey);

    console.log(token_info);

    let data = await groups.get_teacher_groups({id: token_info.id});
    res.json(data);
});


router.get('/lessons', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {
    let token_info = jwt.verify(req.token, config.jwt.secretKey);

    console.log(token_info);

    let data = await lessons.get_all_lessons_by_teacher_id({id: token_info.id});
    res.json(data);
});


module.exports = router;
