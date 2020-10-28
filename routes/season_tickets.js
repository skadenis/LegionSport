'use strict';
let express = require('express');
let router = express.Router();

let Policy = require('cors');
let Schema = require('../components/functions/schema');
let RequestFormat = require('../components/schema/RequestFormat');

const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const WatchChilds = require('../components/functions/Rights/WatchChilds');

let season_tickets = require('../operations/season_tickets');

router.get('/all', Policy(), verifyToken, CheckAuthorization, WatchChilds, async function(req, res, next) {
    let data = await season_tickets.get_all();
    res.json(data);
});

module.exports = router;
