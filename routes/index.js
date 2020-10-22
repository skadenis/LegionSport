let express = require('express');
let router = express.Router();

let system = require('../operations/system_users');

/* GET home page. */
router.post('/auth', async function(req, res, next) {

    let data = await new system().auth(req.body);
    res.json(data);

});

module.exports = router;
