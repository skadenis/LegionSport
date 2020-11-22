'use strict';
let express = require('express');
let router = express.Router();

let Policy = require('cors');

const ManageRights = require('../components/functions/Rights/ManageSystemUsers');

let cashTransfer = require('../operations/cash_transfer');

router.post('/bepaid', Policy(), async function(req, res, next) {
    // Обязательно надо после настроить SchemaJS
    // Обязательно настроить для учетных записей параоль перевод в хеш md5

    await cashTransfer.bepaid_notification(req.body);
    res.json({status: 200}).status(200);
});

module.exports = router;
