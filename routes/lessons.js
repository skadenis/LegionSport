let express = require('express');
let router = express.Router();

let Policy = require('cors');
const verifyToken = require('../components/functions/Token');
const CheckAuthorization = require('../components/functions/CheckAuthorization');
const ManageRights = require('../components/functions/Rights/ManagePrograms');

let lessons = require('../operations/lessons');

router.get('/all',  Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await lessons.get_all();
    res.json(data);
});

router.post('/get-all-by-group', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new lessons().get_all_by_group({group_id: req.body.group});
    res.json(data);
});

router.get('/:id', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await new lessons().get_info({id: req.params.id});
    res.json(data);
});

router.post('/edit', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data;
    if(req.body.id === 0){
        data = await new lessons().create(req.body);
    } else {
        data = await new lessons().edit(req.body);
    }
    res.json(data);
});
router.post('/delete', Policy(), verifyToken, CheckAuthorization, ManageRights, async function(req, res, next) {
    let data = await lessons.delete(req.body);
    res.json(data);
});

module.exports = router;
