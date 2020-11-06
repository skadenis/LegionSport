'use strict';
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');

let config = require('../components/config/index');

let Policy = require('cors');
const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');

router.get('/', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {
    let data = jwt.verify(req.token, config.jwt.secretKey);
    res.json({status:200, data});
});

router.get('/child-token', Policy(), verifyToken, CheckAuthorization, async function(req, res, next) {
    let data = jwt.verify(req.token, config.jwt.secretKey);
    res.json({status:200, data});
});

module.exports = router;
